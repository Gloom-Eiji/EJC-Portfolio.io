"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { crackSeconds, estimate, humanTime, randomSalt, sha256 } from "@/lib/entropy";

const FAST = 1e10; // unsalted SHA-256 on a modern GPU rig, roughly
const SLOW = 1e3; // bcrypt at cost 12 on the same rig, roughly

function verdict(bits: number) {
  if (bits === 0) return "The gate awaits a word.";
  if (bits < 28) return "The gate falls before the horn sounds.";
  if (bits < 45) return "It holds until dawn, then breaks.";
  if (bits < 60) return "A siege of seasons. Respectable.";
  if (bits < 80) return "The walls outlast the besiegers.";
  return "Unbreachable. The siege outlives the kingdom.";
}

export default function SecurityTrial() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [salt, setSalt] = useState<string | null>(null);
  const [digest, setDigest] = useState("");

  const s = estimate(pw);
  const wall = Math.min(20, Math.round((s.bits / 100) * 20));

  useEffect(() => {
    let live = true;
    sha256((salt ?? "") + pw).then((d) => live && setDigest(d));
    return () => {
      live = false;
    };
  }, [pw, salt]);

  return (
    <div id="trial-gate" className="engraved flex flex-col bg-crypt scroll-mt-24">
      <div className="flex items-center justify-between border-b border-[var(--rule)] px-5 py-4">
        <div>
          <p className="label text-bone">Trial II — The Gate</p>
          <p className="mt-1 font-mono text-[0.65rem] text-ash-dim">COMP 324 · Networks &amp; Security</p>
        </div>
        <span className="font-mono text-[0.65rem] text-ash-dim">Web Crypto · in-browser</span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <p className="text-lg leading-relaxed text-ash">
          Speak a passphrase and watch an attacker lay siege. It is hashed with SHA-256 right here, and
          <span className="text-bone"> nothing leaves your browser</span>. Still, don&apos;t use a real password.
        </p>

        <div className="flex items-center gap-2 border border-[var(--rule-strong)] bg-void px-3">
          <label htmlFor="gate-input" className="font-mono text-xs text-ash-dim">
            word:
          </label>
          <input
            id="gate-input"
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            placeholder="correct horse battery staple"
            className="min-w-0 flex-1 bg-transparent py-3 font-mono text-xs text-bone placeholder:text-ash-dim focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide passphrase" : "Show passphrase"}
            className="p-1 text-ash hover:text-bone"
          >
            {show ? <EyeOff size={15} strokeWidth={1.4} /> : <Eye size={15} strokeWidth={1.4} />}
          </button>
        </div>

        {/* Wall meter */}
        <div aria-live="polite">
          <div className="flex items-baseline justify-between">
            <span className="label">Wall strength</span>
            <span className="font-mono text-xs text-bone">≈ {s.bits} bits of entropy</span>
          </div>
          <p className="mt-2 font-mono text-sm tracking-[0.15em] text-bone" aria-hidden>
            [{"█".repeat(wall)}
            <span className="text-ash-dim">{"░".repeat(20 - wall)}</span>]
          </p>
          <p className="mt-2 font-serif text-xl italic text-parchment">{verdict(s.bits)}</p>
          {s.flags.length > 0 && (
            <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-[#c98a7a]">
              Weak points: {s.flags.join(" · ")}
            </p>
          )}
        </div>

        <div className="grid gap-px border border-[var(--rule)] bg-[var(--rule)] font-mono text-xs sm:grid-cols-2">
          <div className="bg-void p-4">
            <p className="label mb-1 text-ash-dim">Unsalted SHA-256</p>
            <p className="text-[0.65rem] text-ash-dim">~10 billion guesses / s</p>
            <p className="mt-2 text-sm text-bone">{pw ? humanTime(crackSeconds(s.bits, FAST)) : "—"}</p>
          </div>
          <div className="bg-void p-4">
            <p className="label mb-1 text-ash-dim">bcrypt, cost 12</p>
            <p className="text-[0.65rem] text-ash-dim">~1,000 guesses / s</p>
            <p className="mt-2 text-sm text-bone">{pw ? humanTime(crackSeconds(s.bits, SLOW)) : "—"}</p>
          </div>
        </div>

        <div className="border border-[var(--rule)] bg-void p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="label">{salt ? "SHA-256(salt + word)" : "SHA-256(word)"}</span>
            <button
              type="button"
              onClick={() => setSalt(randomSalt())}
              className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-ash hover:text-bone"
            >
              <RefreshCw size={12} strokeWidth={1.5} /> {salt ? "Re-salt" : "Add salt"}
            </button>
          </div>
          {salt && <p className="mb-1 break-all font-mono text-[0.65rem] text-gilt">salt: {salt}</p>}
          <p className="break-all font-mono text-[0.7rem] leading-relaxed text-bone">
            {pw ? digest : <span className="text-ash-dim">Type a word to see its digest.</span>}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-ash">
          <span className="text-bone">The lesson:</span> length beats cleverness, and a random salt changes the entire
          digest, so precomputed rainbow tables are useless. Slow hashes like bcrypt or Argon2 turn a weekend
          attack into an impossible one. The estimates are rough, since real attackers use dictionaries and leaked lists.
        </p>
      </div>
    </div>
  );
}
