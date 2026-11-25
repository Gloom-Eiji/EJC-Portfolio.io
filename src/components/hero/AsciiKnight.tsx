"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ART_H, ART_W, drawKnight } from "./knight-art";

const RAMP = " .`:-=+*#%@";
const SCRAMBLE = "#$%&@*+=?/\\|<>01ΞΨ†";
const FPS = 20;

type State = {
  t: number;
  intro: number;
  dissolve: number;
  mx: number;
  my: number;
  hover: boolean;
};

export default function AsciiKnight({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state: State = { t: 2.2, intro: reduced ? 1 : 0, dissolve: 0, mx: -99, my: -99, hover: false };

    let cols = 0;
    let rows = 0;
    let cw = 0;
    let ch = 0;
    let fontSize = 0;
    let fontFamily = "monospace";
    let noise = new Float32Array(0);
    let lum = new Float32Array(0);

    const art = document.createElement("canvas");
    const artCtx = art.getContext("2d")!;
    const small = document.createElement("canvas");
    const smallCtx = small.getContext("2d", { willReadFrequently: true })!;

    function layout() {
      const narrow = window.innerWidth < 640;
      rows = narrow ? 50 : 66;
      cols = Math.round((rows * (ART_W / ART_H)) / 0.6);
      fontFamily =
        getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim() || "monospace";

      ctx!.font = `100px ${fontFamily}`;
      const ratio = ctx!.measureText("M").width / 100 || 0.6;

      // Fit the width of the column, but never taller than ~70% of the viewport.
      const maxW = canvas!.parentElement!.clientWidth;
      const maxH = window.innerHeight * (narrow ? 0.5 : 0.7);
      ch = Math.min(maxW / cols / ratio, maxH / rows);
      fontSize = ch;
      cw = fontSize * ratio;
      const cssW = cols * cw;
      const cssH = rows * ch;
      canvas!.style.width = `${cssW}px`;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(cssW * dpr);
      canvas!.height = Math.round(cssH * dpr);
      canvas!.style.height = `${cssH}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      art.width = cols * 4;
      art.height = rows * 4;
      small.width = cols;
      small.height = rows;
      noise = new Float32Array(cols * rows).map(() => Math.random());
      lum = new Float32Array(cols * rows);
    }

    function sample() {
      artCtx.setTransform(art.width / ART_W, 0, 0, art.height / ART_H, 0, 0);
      drawKnight(artCtx, state.t);
      smallCtx.imageSmoothingEnabled = true;
      smallCtx.imageSmoothingQuality = "high";
      smallCtx.drawImage(art, 0, 0, cols, rows);
      const d = smallCtx.getImageData(0, 0, cols, rows).data;
      for (let i = 0; i < cols * rows; i++) lum[i] = d[i * 4] / 255;
    }

    const buckets: { x: number; y: number; c: string }[][] = Array.from({ length: 8 }, () => []);

    function render() {
      sample();
      for (const b of buckets) b.length = 0;

      const introRow = state.intro * (rows + 6);
      const L = (x: number, y: number) =>
        lum[Math.min(rows - 1, Math.max(0, y)) * cols + Math.min(cols - 1, Math.max(0, x))];

      for (let y = 0; y < rows; y++) {
        if (y > introRow) break;
        const scanning = !reduced && state.intro < 1 && introRow - y < 1.5;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (noise[i] < state.dissolve * 1.1 - 0.05) continue;
          let l = lum[i];

          // lantern: the cursor lights and scrambles nearby glyphs
          let lit = 0;
          if (state.hover) {
            const dx = (x - state.mx) * 0.6;
            const dy = y - state.my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 7) lit = 1 - dist / 7;
          }

          let c: string;
          if (scanning) {
            if (l < 0.03 && Math.random() > 0.15) continue;
            c = SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
            l = 1;
          } else {
            if (l < 0.035 && lit < 0.2) continue;
            // Sobel edges become line glyphs, flat regions use the ramp
            const gx = L(x + 1, y - 1) + 2 * L(x + 1, y) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x - 1, y) - L(x - 1, y + 1);
            const gy = L(x - 1, y + 1) + 2 * L(x, y + 1) + L(x + 1, y + 1) - L(x - 1, y - 1) - 2 * L(x, y - 1) - L(x + 1, y - 1);
            const mag = Math.sqrt(gx * gx + gy * gy);
            if (mag > 1.45 && l > 0.06) {
              const a = ((Math.atan2(gy, gx) % Math.PI) + Math.PI) % Math.PI;
              const P = Math.PI;
              c = a < P / 8 || a >= (7 * P) / 8 ? "|" : a < (3 * P) / 8 ? "/" : a < (5 * P) / 8 ? "-" : "\\";
              l = Math.max(l, 0.55);
            } else {
              c = RAMP[Math.min(RAMP.length - 1, Math.max(1, Math.round(l * (RAMP.length - 1))))];
            }
            if (lit > 0) {
              l = Math.min(1, l + lit * 0.6);
              if (Math.random() < lit * 0.55) c = SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
            } else if (!reduced && Math.random() < 0.004) {
              c = SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
            }
          }
          const bucket = Math.min(7, Math.floor(l * 8));
          buckets[bucket].push({ x, y, c });
        }
      }

      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.save();
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      ctx!.restore();
      ctx!.font = `${fontSize}px ${fontFamily}`;
      ctx!.textBaseline = "top";
      for (let b = 0; b < 8; b++) {
        const list = buckets[b];
        if (!list.length) continue;
        const alpha = 0.16 + (b / 7) * 0.84;
        ctx!.fillStyle = b === 7 ? `rgba(235,230,220,${alpha})` : `rgba(208,204,196,${alpha})`;
        for (const g of list) ctx!.fillText(g.c, g.x * cw, g.y * ch);
      }
    }

    layout();

    let raf = 0;
    let last = 0;
    let running = false;
    let visible = true;
    const start = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;
      state.t = 2.2 + (now - start) / 1000;
      if (state.intro < 1) state.intro = Math.min(1, (now - start) / 1700);
      render();
    };
    const play = () => {
      if (reduced || running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onResize = () => {
      layout();
      render();
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      state.mx = (e.clientX - r.left) / cw;
      state.my = (e.clientY - r.top) / ch;
      state.hover = state.mx >= -4 && state.mx <= cols + 4 && state.my >= -4 && state.my <= rows + 4;
      if (reduced) render();
    };
    const onLeave = () => {
      state.hover = false;
      if (reduced) render();
    };
    const onVis = () => (document.hidden ? pause() : play());

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);

    gsap.registerPlugin(ScrollTrigger);
    const section = canvas.closest("section") ?? canvas;
    const st = reduced
      ? null
      : ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onUpdate: (s) => {
            state.dissolve = s.progress * 0.9;
          },
        });

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      layout();
      render();
      play();
    });
    render();
    play();

    return () => {
      cancelled = true;
      pause();
      io.disconnect();
      st?.kill();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="mx-auto block max-w-full" aria-hidden />
      <span className="sr-only">
        An animated ASCII-art knight in a great helm, hands resting on a planted sword.
      </span>
    </div>
  );
}
