// Rough passphrase-strength model for the Gate trial. Educational, not an
// audit: real crackers use dictionaries, rules and leaked-password lists.

const COMMON = [
  "password", "123456", "12345678", "qwerty", "abc123", "111111", "letmein", "dragon",
  "monkey", "iloveyou", "admin", "welcome", "sunshine", "princess", "football", "master",
  "shadow", "knight", "excalibur", "camelot", "passw0rd", "trustno1",
];

const SEQUENCES = ["abcdefghijklmnopqrstuvwxyz", "0123456789", "qwertyuiop", "asdfghjkl", "zxcvbnm"];

export type Strength = {
  bits: number;
  pool: number;
  length: number;
  flags: string[];
};

export function estimate(pw: string): Strength {
  const flags: string[] = [];
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 33;

  // Collapse repeated runs ("aaaa" counts as ~1 character)
  const collapsed = pw.replace(/(.)\1{2,}/g, "$1$1");
  if (collapsed.length < pw.length) flags.push("repeated characters");

  let effective = collapsed.length;
  const lower = pw.toLowerCase();
  for (const seq of SEQUENCES) {
    for (let n = seq.length; n >= 4; n--) {
      let hit = false;
      for (let i = 0; i + n <= seq.length; i++) {
        if (lower.includes(seq.slice(i, i + n))) { effective -= n - 1; hit = true; break; }
      }
      if (hit) { flags.push("keyboard or alphabet sequence"); break; }
    }
  }

  let bits = Math.max(0, effective) * Math.log2(Math.max(pool, 1));
  const stripped = lower.replace(/[^a-z0-9]/g, "").replace(/[0-9]+$/, "");
  if (COMMON.some((c) => stripped === c || lower === c)) {
    bits = Math.min(bits, 12);
    flags.push("appears on common-password lists");
  } else if (COMMON.some((c) => c.length >= 5 && lower.includes(c))) {
    bits = Math.max(0, bits - 16);
    flags.push("contains a common password");
  }
  if (pw.length > 0 && pw.length < 8) flags.push("shorter than 8 characters");

  return { bits: Math.round(bits), pool, length: pw.length, flags: [...new Set(flags)] };
}

/** Expected seconds to crack: half the keyspace at `rate` guesses/second. */
export function crackSeconds(bits: number, rate: number) {
  return Math.pow(2, Math.max(0, bits - 1)) / rate;
}

const STEPS: [number, string, string][] = [
  [1, "second", "seconds"],
  [60, "minute", "minutes"],
  [3600, "hour", "hours"],
  [86400, "day", "days"],
  [604800, "week", "weeks"],
  [2629800, "month", "months"],
  [31557600, "year", "years"],
  [3155760000, "century", "centuries"],
  [31557600000, "millennium", "millennia"],
];

export function humanTime(s: number): string {
  if (!isFinite(s) || s > 3.15e16) return "longer than the kingdom will stand";
  if (s < 1) return "an instant";
  let step = STEPS[0];
  for (const st of STEPS) if (s >= st[0]) step = st;
  const v = s / step[0];
  const n = v >= 10 ? Math.round(v) : Math.round(v * 10) / 10;
  return `${n.toLocaleString("en-US")} ${n === 1 ? step[1] : step[2]}`;
}

export async function sha256(text: string): Promise<string> {
  if (!globalThis.crypto?.subtle) return "(SubtleCrypto unavailable — needs HTTPS)";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function randomSalt(bytes = 8) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
}
