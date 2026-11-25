"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  act,
  ENEMIES,
  FIRE,
  FLASKS,
  KNIGHT,
  newBattle,
  nextRound,
  PLAYER_MAX,
  ROUNDS,
  SPRITES,
  type Action,
  type BattleState,
  type Fx,
} from "./battle";

const strip = (s: string) => s.replace(/^\n/, "");

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const cells = 16;
  const filled = Math.round((value / max) * cells);
  return (
    <div>
      <div className="flex justify-between font-mono text-[0.65rem] uppercase tracking-wider text-ash">
        <span>{label}</span>
        <span className="text-bone">
          {value}/{max}
        </span>
      </div>
      <p className="mt-1 font-mono text-xs tracking-[0.08em] text-bone" aria-hidden>
        [{"█".repeat(filled)}
        <span className="text-ash-dim">{"░".repeat(cells - filled)}</span>]
      </p>
    </div>
  );
}

function FloatingFx({ fx, target }: { fx: Fx[]; target: Fx["target"] }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center" aria-hidden>
      <AnimatePresence>
        {fx
          .filter((f) => f.target === target)
          .map((f, i) => (
            <motion.span
              key={f.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 1, 0], y: -28 - i * 14 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`absolute font-mono text-sm ${
                f.tone === "heal"
                  ? "text-[#9fc79a]"
                  : f.tone === "crit"
                    ? "text-gilt"
                    : f.tone === "block" || f.tone === "miss"
                      ? "text-ash"
                      : "text-[#d08a7a]"
              }`}
            >
              {f.text}
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  );
}

export default function KnightBattle() {
  const [s, setS] = useState<BattleState>(() => newBattle());
  const [shake, setShake] = useState<{ who: "player" | "enemy"; n: number } | null>(null);

  const play = useCallback(
    (a: Action) => {
      const next = act(s, a);
      if (next === s) return;
      setS(next);
      const hitPlayer = next.player.hp < s.player.hp;
      const hitEnemy = next.enemy.hp < s.enemy.hp;
      if (hitEnemy) setShake({ who: "enemy", n: next.seq });
      if (hitPlayer) window.setTimeout(() => setShake({ who: "player", n: next.seq + 1 }), 220);
    },
    [s],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toLowerCase();
      if (s.phase === "choose") {
        if (k === "1" || k === "a") play("attack");
        else if (k === "2" || k === "d") play("defend");
        else if (k === "3" || k === "h") play("heal");
      } else if (k === "enter" || k === " ") {
        e.preventDefault();
        setS(s.phase === "round-won" ? nextRound(s) : newBattle());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s, play]);

  const def = ENEMIES[s.enemy.kind];
  const isBoss = s.enemy.kind === "dragon";

  return (
    <div>
      {/* Round track */}
      <ol className="mb-5 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider" aria-label="Rounds">
        {Array.from({ length: ROUNDS }).map((_, i) => {
          const r = i + 1;
          const done = r < s.round || (r === s.round && (s.phase === "round-won" || s.phase === "victory"));
          return (
            <li
              key={r}
              aria-current={r === s.round ? "step" : undefined}
              className={`flex-1 border px-2 py-1.5 text-center ${
                r === s.round ? "border-bone text-bone" : done ? "border-[var(--rule)] text-ash line-through" : "border-[var(--rule)] text-ash-dim"
              }`}
            >
              {r === ROUNDS ? "Boss" : `Round ${r}`}
            </li>
          );
        })}
      </ol>

      {/* Arena */}
      <div className="engraved relative overflow-hidden bg-void px-3 pb-4 pt-10 sm:px-6">
        <div className="grid grid-cols-2 items-end gap-2">
          <div className="relative">
            <FloatingFx fx={s.fx} target="player" />
            <motion.pre
              key={shake?.who === "player" ? shake.n : "p"}
              animate={shake?.who === "player" ? { x: [0, -6, 6, -3, 0] } : {}}
              transition={{ duration: 0.35 }}
              className={`font-mono text-[0.62rem] leading-[1.15] sm:text-xs ${
                s.player.guarding ? "text-gilt" : s.phase === "defeat" ? "text-ash-dim" : "text-bone"
              }`}
              aria-hidden
            >
              {strip(KNIGHT)}
            </motion.pre>
          </div>
          <div className="relative flex justify-end">
            <FloatingFx fx={s.fx} target="enemy" />
            <div className="flex items-end">
              {isBoss && s.enemy.charging && (
                <span className="mb-6 mr-1 hidden animate-pulse font-mono text-xs text-[#d08a7a] sm:inline" aria-hidden>
                  ...
                </span>
              )}
              <motion.pre
                key={shake?.who === "enemy" ? shake.n : "e"}
                animate={shake?.who === "enemy" ? { x: [0, 6, -6, 3, 0] } : {}}
                transition={{ duration: 0.35 }}
                className={`font-mono leading-[1.15] ${isBoss ? "text-[0.5rem] sm:text-[0.68rem]" : "text-[0.62rem] sm:text-xs"} ${
                  s.enemy.hp <= 0 ? "text-ash-dim opacity-40" : s.enemy.enraged ? "text-[#d08a7a]" : "text-bone"
                }`}
                aria-hidden
              >
                {strip(SPRITES[s.enemy.kind])}
              </motion.pre>
            </div>
          </div>
        </div>
        {isBoss && s.log.at(-1)?.includes("FIRE BREATH") && (
          <p className="mt-2 text-center font-mono text-xs tracking-[0.3em] text-[#d08a7a]" aria-hidden>
            {FIRE} {FIRE}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-6 border-t border-[var(--rule)] pt-4">
          <div>
            <Bar value={s.player.hp} max={PLAYER_MAX} label="Knight" />
            <p className="mt-2 font-mono text-[0.65rem] text-ash">
              Flasks {"♦".repeat(s.player.flasks)}
              <span className="text-ash-dim">{"◊".repeat(FLASKS - s.player.flasks)}</span>
              {s.player.guarding && <span className="ml-2 text-gilt">guarding</span>}
              {s.player.riposte && !s.player.guarding && <span className="ml-2 text-gilt">riposte ready</span>}
              {s.player.hexed && <span className="ml-2 text-[#b49ad6]">hexed</span>}
            </p>
          </div>
          <div>
            <Bar value={s.enemy.hp} max={s.enemy.max} label={def.name} />
            <p className="mt-2 font-mono text-[0.65rem] text-ash">
              {def.epithet}
              {s.enemy.charging && <span className="ml-2 text-[#d08a7a]">drawing breath!</span>}
              {s.enemy.enraged && <span className="ml-2 text-[#d08a7a]">enraged</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="mt-4 h-32 overflow-hidden border border-[var(--rule)] bg-void p-3 font-mono text-[0.7rem] leading-relaxed" aria-live="polite">
        {s.log.slice(-5).map((l, i, arr) => (
          <p key={`${s.seq}-${i}`} className={i === arr.length - 1 ? "text-bone" : "text-ash-dim"}>
            &gt; {l}
          </p>
        ))}
      </div>

      {/* Commands */}
      {s.phase === "choose" ? (
        <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Your move">
          {(
            [
              ["attack", "Attack", "1 / A", "5–9 dmg, may crit"],
              ["defend", "Defend", "2 / D", "Block most damage, riposte next"],
              ["heal", "Heal", "3 / H", `${s.player.flasks} flask${s.player.flasks === 1 ? "" : "s"} left`],
            ] as const
          ).map(([a, label, key, hint], i) => (
            <button
              key={a}
              type="button"
              data-autofocus={i === 0 ? true : undefined}
              onClick={() => play(a)}
              disabled={a === "heal" && s.player.flasks === 0}
              className="group border border-[var(--rule-strong)] px-2 py-3 text-left transition-colors hover:border-bone hover:bg-bone hover:text-void disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-bone"
            >
              <span className="flex items-baseline justify-between">
                <span className="font-serif text-xl leading-none">{label}</span>
                <span className="font-mono text-[0.6rem] text-ash group-hover:text-void/60">{key}</span>
              </span>
              <span className="mt-1.5 block font-mono text-[0.6rem] leading-snug text-ash group-hover:text-void/70">{hint}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-[var(--rule-strong)] p-4">
          <p className="font-serif text-xl text-parchment">
            {s.phase === "round-won"
              ? s.round + 1 === ROUNDS
                ? "The skirmishes are won. Something vast stirs ahead."
                : "Victory. The road continues."
              : s.phase === "victory"
                ? "The wyrm is slain. You have walked the whole Gauntlet."
                : "Defeat. Rise, knight, and try again."}
          </p>
          <button
            type="button"
            data-autofocus
            onClick={() => setS(s.phase === "round-won" ? nextRound(s) : newBattle())}
            className="border border-bone bg-bone px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-void transition-colors hover:bg-transparent hover:text-bone"
          >
            {s.phase === "round-won" ? (s.round + 1 === ROUNDS ? "Face the boss ↵" : "Next foe ↵") : "Play again ↵"}
          </button>
        </div>
      )}
    </div>
  );
}
