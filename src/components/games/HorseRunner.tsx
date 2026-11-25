"use client";

import { useEffect, useRef, useState } from "react";

// "The Ride": an endless runner. The world is a grid of character cells; all
// positions below are in cells, and the canvas draws each sprite as text.

const COLS = 72;
const ROWS = 16;
const GROUND = 13; // row index of the ground line
const KNIGHT_X = 4;

const RIDE = [
  String.raw`      [=]~`,
  String.raw`     /|#|\-----`,
  String.raw` ___/_|_|_\___ /\ `,
  String.raw`(____________ \ o>`,
];
const LEGS = [String.raw`   /\     /\  '-'`, String.raw`   ||     ||  '-'`, String.raw`   \/     \/  '-'`, String.raw`   ||     ||  '-'`];
const DUCK = [
  String.raw` ___[=]==========`,
  String.raw`(___/#\_____ /\ `,
  String.raw`(___________\ o>`,
];

type Kind = "barrel" | "bale" | "stack" | "bird";
const OBSTACLES: Record<Kind, { art: string[]; w: number; h: number; lift: number }> = {
  barrel: { art: [" __ ", "|==|", "|__|"], w: 4, h: 3, lift: 0 },
  bale: { art: [".----.", "|////|"], w: 6, h: 2, lift: 0 },
  stack: { art: [" .--. ", ".----.", "|////|"], w: 6, h: 3, lift: 0 },
  bird: { art: ["\\v/"], w: 3, h: 1, lift: 4.2 },
};
const BIRD_FLAP = ["\\v/", "-v-"];

type Obstacle = { kind: Kind; x: number };
type Phase = "ready" | "running" | "over";

const JUMP_V = 34; // rows / s
const GRAVITY = 80; // rows / s²
const BEST_KEY = "ride-best";

export default function HorseRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  // This component only renders in the browser (loaded with ssr: false).
  const [best, setBest] = useState(() =>
    typeof window === "undefined" ? 0 : Number(localStorage.getItem(BEST_KEY) ?? 0) || 0,
  );
  const input = useRef({ jump: false, duck: false });
  const phaseRef = useRef<Phase>("ready");

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let cw = 10;
    let ch = 16;
    let font = "monospace";

    const world = {
      y: 0,
      vy: 0,
      ducking: false,
      speed: 24,
      dist: 0,
      t: 0,
      obstacles: [] as Obstacle[],
      nextSpawn: 40,
      groundOffset: 0,
    };

    const reset = () => {
      Object.assign(world, { y: 0, vy: 0, ducking: false, speed: 24, dist: 0, t: 0, obstacles: [], nextSpawn: 40, groundOffset: 0 });
      setScore(0);
    };

    const layout = () => {
      const w = canvas.parentElement!.clientWidth;
      font = getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim() || "monospace";
      ctx.font = `100px ${font}`;
      const ratio = ctx.measureText("M").width / 100 || 0.6;
      cw = w / COLS;
      const size = cw / ratio;
      ch = size * 1.05;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(ROWS * ch * dpr);
      canvas.style.height = `${ROWS * ch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${size}px ${font}`;
      ctx.textBaseline = "top";
    };

    const text = (lines: string[], x: number, topRow: number, color: string) => {
      ctx.fillStyle = color;
      lines.forEach((l, i) => ctx.fillText(l, x * cw, (topRow + i) * ch));
    };

    const draw = () => {
      const w = COLS * cw;
      ctx.clearRect(0, 0, w, ROWS * ch);

      // sky: a moon and a few fixed stars
      text(["  _  ", " ( ) ", "  ‾  "], COLS - 10, 1, "rgba(208,204,196,0.35)");
      for (const [sx, sy] of [[8, 2], [21, 1], [33, 3], [47, 2], [58, 4]]) text(["."], sx, sy, "rgba(208,204,196,0.3)");

      // ground
      ctx.fillStyle = "rgba(208,204,196,0.55)";
      ctx.fillRect(0, GROUND * ch + ch * 0.15, w, 1);
      const off = world.groundOffset % 9;
      const pebbles = Array.from({ length: COLS + 9 }, (_, i) => ((i * 7) % 9 === 0 ? "." : (i * 5) % 11 === 0 ? "," : " ")).join("");
      ctx.fillStyle = "rgba(208,204,196,0.3)";
      ctx.fillText(pebbles, -off * cw, (GROUND + 0.6) * ch);

      // obstacles
      for (const o of world.obstacles) {
        const def = OBSTACLES[o.kind];
        const art = o.kind === "bird" ? [BIRD_FLAP[Math.floor(world.t * 6) % 2]] : def.art;
        text(art, o.x, GROUND - def.lift - def.h, o.kind === "bird" ? "#ebe6dc" : "rgba(208,204,196,0.78)");
      }

      // knight on horseback
      const frame = phaseRef.current === "running" && world.y === 0 ? Math.floor(world.t * 12) % LEGS.length : 0;
      const body = world.ducking && world.y === 0 ? DUCK : RIDE;
      const sprite = [...body, LEGS[frame]];
      text(sprite, KNIGHT_X, GROUND - sprite.length - world.y, phaseRef.current === "over" ? "rgba(208,204,196,0.45)" : "#ebe6dc");

      if (phaseRef.current !== "running") {
        const msg = phaseRef.current === "ready" ? "PRESS SPACE / TAP TO RIDE" : "UNHORSED. SPACE / TAP TO RIDE AGAIN";
        ctx.fillStyle = "#ebe6dc";
        ctx.fillText(msg, ((COLS - msg.length) / 2) * cw, 6 * ch);
      }
    };

    const hit = () => {
      // Knight hitbox: horse body + rider, a little inset for fairness.
      const ducking = world.ducking && world.y === 0;
      const kx0 = KNIGHT_X + 4;
      const kx1 = KNIGHT_X + 14;
      const ky0 = world.y + 0.3;
      const ky1 = world.y + (ducking ? 3.6 : 4.8);
      return world.obstacles.some((o) => {
        const d = OBSTACLES[o.kind];
        const ox0 = o.x + 0.4;
        const ox1 = o.x + d.w - 0.4;
        const oy0 = d.lift + 0.1;
        const oy1 = d.lift + d.h - 0.2;
        return kx0 < ox1 && kx1 > ox0 && ky0 < oy1 && ky1 > oy0;
      });
    };

    const spawn = () => {
      const r = Math.random();
      const kind: Kind = world.dist > 120 && r < 0.28 ? "bird" : r < 0.55 ? "barrel" : r < 0.8 ? "bale" : "stack";
      world.obstacles.push({ kind, x: COLS + 2 });
      world.nextSpawn = world.dist + world.speed * (0.9 + Math.random() * 0.9) + 8;
    };

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (phaseRef.current === "running" && !document.hidden) {
        world.t += dt;
        world.speed = Math.min(50, 24 + world.t * 0.55);
        const dx = world.speed * dt;
        world.dist += dx;
        world.groundOffset += dx;

        if (input.current.jump && world.y === 0) world.vy = JUMP_V;
        input.current.jump = false;
        world.ducking = input.current.duck;
        if (world.y > 0 || world.vy > 0) {
          // holding duck mid-air drops you faster
          world.vy -= GRAVITY * (input.current.duck ? 2.2 : 1) * dt;
          world.y = Math.max(0, world.y + world.vy * dt);
          if (world.y === 0) world.vy = 0;
        }

        for (const o of world.obstacles) o.x -= dx + (o.kind === "bird" ? 6 * dt : 0);
        world.obstacles = world.obstacles.filter((o) => o.x > -8);
        if (world.dist >= world.nextSpawn) spawn();

        const sc = Math.floor(world.dist / 4);
        setScore(sc);
        if (hit()) {
          phaseRef.current = "over";
          setPhase("over");
          setBest((b) => {
            const nb = Math.max(b, sc);
            localStorage.setItem(BEST_KEY, String(nb));
            return nb;
          });
        }
      }
      draw();
    };

    const start = () => {
      if (phaseRef.current !== "running") {
        reset();
        phaseRef.current = "running";
        setPhase("running");
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === " " || k === "ArrowUp" || k === "w" || k === "W") {
        e.preventDefault();
        if (phaseRef.current !== "running") start();
        else input.current.jump = true;
      } else if (k === "ArrowDown" || k === "s" || k === "S") {
        e.preventDefault();
        input.current.duck = e.type === "keydown";
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") input.current.duck = false;
    };
    const onTap = () => {
      if (phaseRef.current !== "running") start();
      else input.current.jump = true;
    };

    // expose for the on-screen buttons
    (canvas as HTMLCanvasElement & { __start?: () => void }).__start = start;

    layout();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", layout);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onTap);
    document.fonts?.ready.then(layout);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }, []);

  const startOrJump = () => {
    const c = canvasRef.current as (HTMLCanvasElement & { __start?: () => void }) | null;
    if (phaseRef.current !== "running") c?.__start?.();
    else input.current.jump = true;
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em]">
        <span className="text-bone">Score {String(score).padStart(5, "0")}</span>
        <span className="text-ash">Best {String(Math.max(best, phase === "over" ? score : 0)).padStart(5, "0")}</span>
      </div>
      <div className="engraved overflow-hidden bg-void px-2 py-3">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none select-none"
          role="img"
          aria-label="Endless runner: a knight on horseback jumps barrels and hay bales and ducks under birds."
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          data-autofocus
          onPointerDown={(e) => {
            e.preventDefault();
            startOrJump();
          }}
          onKeyDown={(e) => e.key === "Enter" && startOrJump()}
          className="border border-[var(--rule-strong)] px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone active:bg-bone active:text-void"
        >
          {phase === "running" ? "Jump ↑" : "Ride ↵"}
        </button>
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            input.current.duck = true;
          }}
          onPointerUp={() => (input.current.duck = false)}
          onPointerLeave={() => (input.current.duck = false)}
          onPointerCancel={() => (input.current.duck = false)}
          className="border border-[var(--rule-strong)] px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone active:bg-bone active:text-void"
        >
          Duck ↓ (hold)
        </button>
      </div>
      <p className="mt-3 font-mono text-[0.65rem] text-ash-dim">
        Space / ↑ to jump · hold ↓ to duck under birds · tap the field to jump on touch screens
      </p>
    </div>
  );
}
