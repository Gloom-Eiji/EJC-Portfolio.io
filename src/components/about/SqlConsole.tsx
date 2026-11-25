"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { courses } from "@/data/courses";
import { projects } from "@/data/projects";
import { skills, categories } from "@/data/skills";
import { formatTable, runQuery, SqlError, type Database } from "@/lib/sql";

const PRESETS = [
  { label: "Security & systems", sql: "SELECT code, title, term FROM courses WHERE domain IN ('security', 'systems');" },
  { label: "Courses per school", sql: "SELECT domain, COUNT(*) FROM courses GROUP BY domain ORDER BY count DESC;" },
  { label: "Data, 2025+", sql: "SELECT code, title FROM courses WHERE domain = 'data' AND year >= 2025;" },
  { label: "Where Python is used", sql: "SELECT title, timeframe FROM projects WHERE stack LIKE '%python%';" },
  { label: "Show tables", sql: "SHOW TABLES;" },
];

type Entry = { sql: string; out: string; error?: boolean };

export default function SqlConsole() {
  const db: Database = useMemo(
    () => ({
      courses: {
        columns: ["code", "title", "term", "year", "units", "domain"],
        rows: courses.map(({ code, title, term, year, units, domain }) => ({ code, title, term, year, units, domain })),
      },
      projects: {
        columns: ["id", "title", "category", "timeframe", "stack"],
        rows: projects.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          timeframe: p.timeframe ?? "—",
          stack: p.stack.join(", "),
        })),
      },
      skills: {
        columns: ["name", "category", "kind"],
        rows: skills.map((s) => ({
          name: s.name,
          category: s.category,
          kind: categories.find((c) => c.id === s.category)!.meaning,
        })),
      },
    }),
    [],
  );

  const [input, setInput] = useState("");
  const [log, setLog] = useState<Entry[]>([]);
  const [hist, setHist] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const outRef = useRef<HTMLDivElement>(null);

  const exec = (sql: string) => {
    let entry: Entry;
    try {
      const r = runQuery(db, sql);
      entry =
        r.kind === "text"
          ? { sql, out: r.text }
          : { sql, out: formatTable(r.columns, r.rows) + (r.note ? `\n${r.note}` : "") };
    } catch (e) {
      entry = { sql, out: e instanceof SqlError ? `✗ ${e.message}` : "✗ The scribe faltered.", error: true };
    }
    setLog((l) => [...l.slice(-5), entry]);
    setHist((h) => [sql, ...h.filter((x) => x !== sql)].slice(0, 20));
    setHIdx(-1);
  };

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  return (
    <div id="trial-scriptorium" className="engraved flex flex-col bg-crypt scroll-mt-24">
      <div className="flex items-center justify-between border-b border-[var(--rule)] px-5 py-4">
        <div>
          <p className="label text-bone">Trial I — The Scriptorium</p>
          <p className="mt-1 font-mono text-[0.65rem] text-ash-dim">COMP 440 · Database Design</p>
        </div>
        <span className="font-mono text-[0.65rem] text-ash-dim">sqlite-ish · in-browser</span>
      </div>

      <div className="px-5 pt-5">
        <p className="text-lg leading-relaxed text-ash">
          My coursework, projects and skills live in three tables. Interrogate them with real SQL:
          <span className="text-bone"> SELECT, WHERE, LIKE, IN, GROUP BY, ORDER BY, LIMIT</span>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setInput(p.sql);
                exec(p.sql);
              }}
              className="border border-[var(--rule)] px-2.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-ash transition-colors hover:border-bone hover:text-bone"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={outRef}
        className="no-scrollbar m-5 mb-0 h-72 overflow-auto border border-[var(--rule)] bg-void p-4 font-mono text-[0.7rem] leading-relaxed"
        aria-live="polite"
        data-lenis-prevent
      >
        {log.length === 0 ? (
          <p className="text-ash-dim">
            {"-- Choose a query above or write your own.\n"}
            <br />
            {"-- Try: HELP;  or  DESCRIBE courses;"}
          </p>
        ) : (
          log.map((e, i) => (
            <div key={i} className="mb-4">
              <p className="text-bone">
                <span className="text-ash-dim">codex=# </span>
                {e.sql}
              </p>
              <pre className={`mt-1 whitespace-pre ${e.error ? "text-[#c98a7a]" : "text-ash"}`}>{e.out}</pre>
            </div>
          ))
        )}
      </div>

      <form
        className="m-5 flex items-center gap-2 border border-[var(--rule-strong)] bg-void px-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) exec(input.trim());
        }}
      >
        <label htmlFor="sql-input" className="font-mono text-xs text-ash-dim">
          codex=#
        </label>
        <input
          id="sql-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" && hist.length) {
              e.preventDefault();
              const n = Math.min(hist.length - 1, hIdx + 1);
              setHIdx(n);
              setInput(hist[n]);
            } else if (e.key === "ArrowDown" && hIdx >= 0) {
              e.preventDefault();
              const n = hIdx - 1;
              setHIdx(n);
              setInput(n >= 0 ? hist[n] : "");
            }
          }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          placeholder="SELECT * FROM courses LIMIT 5;"
          className="min-w-0 flex-1 bg-transparent py-3 font-mono text-xs text-bone placeholder:text-ash-dim focus:outline-none"
        />
        <button type="submit" className="label py-2 pl-2 text-bone hover:text-parchment">
          Run ↵
        </button>
      </form>
    </div>
  );
}
