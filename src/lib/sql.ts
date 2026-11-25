// A deliberately small SQL engine for the Scriptorium console.
// Supports: SELECT cols | * | COUNT(*) [AS x] FROM t [WHERE ...] [GROUP BY c]
//           [ORDER BY c [ASC|DESC]] [LIMIT n]; SHOW TABLES; DESCRIBE t; HELP
// WHERE supports =, !=, <>, <, <=, >, >=, LIKE, IN (...), joined by AND / OR.

export type Value = string | number;
export type Row = Record<string, Value>;
export type Table = { columns: string[]; rows: Row[] };
export type Database = Record<string, Table>;

export type QueryResult =
  | { kind: "table"; columns: string[]; rows: Value[][]; note?: string }
  | { kind: "text"; text: string };

export class SqlError extends Error {}

type Tok = { t: "kw" | "id" | "str" | "num" | "op" | "punc"; v: string };

const KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "AND", "OR", "LIKE", "IN", "ORDER", "BY", "ASC", "DESC",
  "LIMIT", "GROUP", "COUNT", "AS", "SHOW", "TABLES", "DESCRIBE", "DESC", "HELP", "NOT",
]);

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "'" || c === '"') {
      const q = c; let j = i + 1; let s = "";
      while (j < src.length && src[j] !== q) s += src[j++];
      if (j >= src.length) throw new SqlError("An unclosed quotation — the scribe's ink runs off the page.");
      toks.push({ t: "str", v: s }); i = j + 1; continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i; while (j < src.length && /[0-9.]/.test(src[j])) j++;
      toks.push({ t: "num", v: src.slice(i, j) }); i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i; while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      const w = src.slice(i, j);
      toks.push(KEYWORDS.has(w.toUpperCase()) ? { t: "kw", v: w.toUpperCase() } : { t: "id", v: w.toLowerCase() });
      i = j; continue;
    }
    const two = src.slice(i, i + 2);
    if (["<=", ">=", "!=", "<>"].includes(two)) { toks.push({ t: "op", v: two }); i += 2; continue; }
    if ("=<>".includes(c)) { toks.push({ t: "op", v: c }); i++; continue; }
    if ("*,();".includes(c)) { toks.push({ t: "punc", v: c }); i++; continue; }
    throw new SqlError(`Unknown rune '${c}'.`);
  }
  return toks;
}

type Cond = { col: string; op: string; val: Value | Value[]; not?: boolean };
type Where = Cond[][]; // OR of ANDs

type SelectItem = { kind: "col"; col: string } | { kind: "count"; alias: string };

class Parser {
  i = 0;
  constructor(private toks: Tok[]) {}
  peek(o = 0) { return this.toks[this.i + o]; }
  isKw(v: string) { const t = this.peek(); return t?.t === "kw" && t.v === v; }
  isP(v: string) { const t = this.peek(); return t?.t === "punc" && t.v === v; }
  next() { return this.toks[this.i++]; }
  kw(v: string) {
    if (!this.isKw(v)) throw new SqlError(`Expected ${v}${this.peek() ? ` near '${this.peek().v}'` : " but the scroll ended"}.`);
    this.i++;
  }
  punc(v: string) {
    if (!this.isP(v)) throw new SqlError(`Expected '${v}'${this.peek() ? ` near '${this.peek().v}'` : ""}.`);
    this.i++;
  }
  ident() {
    const t = this.next();
    if (!t || t.t !== "id") throw new SqlError(`Expected a column or table name${t ? ` but found '${t.v}'` : ""}.`);
    return t.v;
  }
  literal(): Value {
    const t = this.next();
    if (!t) throw new SqlError("Expected a value.");
    if (t.t === "str") return t.v;
    if (t.t === "num") return Number(t.v);
    throw new SqlError(`Expected a value but found '${t.v}'. Wrap text in 'quotes'.`);
  }
  done() { return this.i >= this.toks.length || (this.isP(";") && this.i === this.toks.length - 1); }
}

function parseWhere(p: Parser): Where {
  const groups: Where = [[]];
  for (;;) {
    const col = p.ident();
    let not = false;
    if (p.isKw("NOT")) { p.next(); not = true; }
    let cond: Cond;
    if (p.isKw("LIKE")) { p.next(); cond = { col, op: "LIKE", val: p.literal(), not }; }
    else if (p.isKw("IN")) {
      p.next(); p.punc("(");
      const vals: Value[] = [p.literal()];
      while (p.isP(",")) { p.next(); vals.push(p.literal()); }
      p.punc(")");
      cond = { col, op: "IN", val: vals, not };
    } else {
      const t = p.next();
      if (!t || t.t !== "op") throw new SqlError(`Expected a comparison after '${col}'.`);
      cond = { col, op: t.v, val: p.literal() };
    }
    groups[groups.length - 1].push(cond);
    if (p.isKw("AND")) { p.next(); continue; }
    if (p.isKw("OR")) { p.next(); groups.push([]); continue; }
    break;
  }
  return groups;
}

function cmp(a: Value, b: Value) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
}

function likeToRegex(pat: string) {
  const esc = pat.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".");
  return new RegExp(`^${esc}$`, "i");
}

function test(row: Row, c: Cond): boolean {
  if (!(c.col in row)) throw new SqlError(`No column named '${c.col}'.`);
  const v = row[c.col];
  let r: boolean;
  switch (c.op) {
    case "=": r = cmp(v, c.val as Value) === 0; break;
    case "!=": case "<>": r = cmp(v, c.val as Value) !== 0; break;
    case "<": r = cmp(v, c.val as Value) < 0; break;
    case "<=": r = cmp(v, c.val as Value) <= 0; break;
    case ">": r = cmp(v, c.val as Value) > 0; break;
    case ">=": r = cmp(v, c.val as Value) >= 0; break;
    case "LIKE": r = likeToRegex(String(c.val)).test(String(v)); break;
    case "IN": r = (c.val as Value[]).some((x) => cmp(v, x) === 0); break;
    default: throw new SqlError(`Unknown operator ${c.op}.`);
  }
  return c.not ? !r : r;
}

export const HELP_TEXT = [
  "The Scriptorium understands a small dialect of SQL:",
  "  SHOW TABLES;              DESCRIBE courses;",
  "  SELECT code, title FROM courses WHERE domain = 'security';",
  "  SELECT domain, COUNT(*) FROM courses GROUP BY domain ORDER BY count DESC;",
  "  SELECT title FROM courses WHERE title LIKE '%data%' AND year >= 2025;",
  "Operators: = != < <= > >= LIKE IN (...) NOT, joined by AND / OR. LIMIT n.",
].join("\n");

export function runQuery(db: Database, sql: string): QueryResult {
  const toks = tokenize(sql.trim());
  if (toks.length === 0) throw new SqlError("The page is blank. Try HELP.");
  const p = new Parser(toks);

  if (p.isKw("HELP")) return { kind: "text", text: HELP_TEXT };
  if (p.isKw("SHOW")) {
    p.next(); p.kw("TABLES");
    return { kind: "table", columns: ["table", "rows"], rows: Object.entries(db).map(([n, t]) => [n, t.rows.length]) };
  }
  if (p.isKw("DESCRIBE") || (p.isKw("DESC") && p.peek(1)?.t === "id")) {
    p.next();
    const name = p.ident();
    const t = db[name];
    if (!t) throw new SqlError(`No table named '${name}'. Try SHOW TABLES.`);
    return {
      kind: "table", columns: ["column", "type"],
      rows: t.columns.map((c) => [c, typeof t.rows[0]?.[c] === "number" ? "INTEGER" : "TEXT"]),
    };
  }

  p.kw("SELECT");
  const items: SelectItem[] = [];
  let star = false;
  if (p.isP("*")) { p.next(); star = true; }
  else {
    for (;;) {
      if (p.isKw("COUNT")) {
        p.next(); p.punc("("); p.punc("*"); p.punc(")");
        let alias = "count";
        if (p.isKw("AS")) { p.next(); alias = p.ident(); }
        items.push({ kind: "count", alias });
      } else items.push({ kind: "col", col: p.ident() });
      if (p.isP(",")) { p.next(); continue; }
      break;
    }
  }
  p.kw("FROM");
  const tname = p.ident();
  const table = db[tname];
  if (!table) throw new SqlError(`No table named '${tname}'. Try SHOW TABLES.`);

  let where: Where | null = null;
  let groupBy: string | null = null;
  let order: { col: string; desc: boolean } | null = null;
  let limit: number | null = null;

  if (p.isKw("WHERE")) { p.next(); where = parseWhere(p); }
  if (p.isKw("GROUP")) { p.next(); p.kw("BY"); groupBy = p.ident(); }
  if (p.isKw("ORDER")) {
    p.next(); p.kw("BY");
    let col: string;
    if (p.isKw("COUNT")) {
      // accept both `ORDER BY COUNT(*)` and the alias `ORDER BY count`
      p.next();
      if (p.isP("(")) { p.punc("("); p.punc("*"); p.punc(")"); }
      col = "count";
    } else col = p.ident();
    let desc = false;
    if (p.isKw("ASC")) p.next(); else if (p.isKw("DESC")) { p.next(); desc = true; }
    order = { col, desc };
  }
  if (p.isKw("LIMIT")) {
    p.next();
    const n = p.literal();
    if (typeof n !== "number") throw new SqlError("LIMIT needs a number.");
    limit = n;
  }
  if (!p.done()) throw new SqlError(`Unexpected '${p.peek().v}'.`);

  for (const it of items) if (it.kind === "col" && !table.columns.includes(it.col))
    throw new SqlError(`No column named '${it.col}' in ${tname}. Try DESCRIBE ${tname};`);

  let rows = table.rows.filter((r) => !where || where.some((g) => g.every((c) => test(r, c))));
  let columns: string[];
  let out: Row[];

  const hasCount = items.some((i) => i.kind === "count");
  if (groupBy || hasCount) {
    if (star) throw new SqlError("SELECT * cannot be combined with grouping.");
    if (groupBy && !table.columns.includes(groupBy)) throw new SqlError(`No column named '${groupBy}'.`);
    const buckets = new Map<string, Row[]>();
    for (const r of rows) {
      const k = groupBy ? String(r[groupBy]) : "*";
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k)!.push(r);
    }
    if (!groupBy && buckets.size === 0) buckets.set("*", []);
    for (const it of items) if (it.kind === "col" && it.col !== groupBy)
      throw new SqlError(`'${it.col}' must appear in GROUP BY to be selected alongside COUNT(*).`);
    columns = items.map((i) => (i.kind === "count" ? i.alias : i.col));
    out = [...buckets.values()].map((b) => {
      const o: Row = {};
      for (const it of items) o[it.kind === "count" ? it.alias : it.col] = it.kind === "count" ? b.length : b[0][it.col];
      return o;
    });
  } else {
    columns = star ? table.columns : items.map((i) => (i as { col: string }).col);
    out = rows;
  }

  if (order) {
    const { col, desc } = order;
    const key = out.length && !(col in out[0]) && order.col === "count"
      ? columns.find((c) => typeof out[0][c] === "number") ?? col
      : col;
    if (out.length && !(key in out[0])) throw new SqlError(`Cannot order by '${col}'.`);
    out = [...out].sort((a, b) => (desc ? -1 : 1) * cmp(a[key], b[key]));
  }
  if (limit !== null) out = out.slice(0, limit);
  rows = out;

  return {
    kind: "table",
    columns,
    rows: rows.map((r) => columns.map((c) => r[c])),
    note: `${rows.length} row${rows.length === 1 ? "" : "s"} returned`,
  };
}

export function formatTable(columns: string[], rows: Value[][], maxCell = 34): string {
  const clip = (v: Value) => {
    const s = String(v);
    return s.length > maxCell ? s.slice(0, maxCell - 1) + "…" : s;
  };
  const cells = rows.map((r) => r.map(clip));
  const widths = columns.map((c, i) => Math.max(c.length, ...cells.map((r) => r[i].length)));
  const line = "+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+";
  const fmt = (r: string[]) => "| " + r.map((v, i) => v.padEnd(widths[i])).join(" | ") + " |";
  return [line, fmt(columns), line, ...cells.map(fmt), line].join("\n");
}
