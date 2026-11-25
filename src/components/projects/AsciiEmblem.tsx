"use client";

import { useEffect, useRef } from "react";

/** An ASCII plate that inks itself in, glyph by glyph, when first seen. */
export default function AsciiEmblem({ art, className = "" }: { art: string; className?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const text = art.replace(/^\n/, "");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = [...text];
    const order = chars.map((c, i) => (c.trim() ? i : -1)).filter((i) => i >= 0);
    for (let i = order.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [order[i], order[j]] = [order[j], order[i]];
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const shown = chars.map((c) => (c.trim() ? " " : c));
        el.textContent = shown.join("");
        const start = performance.now();
        const dur = 1100;
        let done = 0;
        const step = (now: number) => {
          const target = Math.floor(Math.min(1, (now - start) / dur) * order.length);
          for (; done < target; done++) shown[order[done]] = chars[order[done]];
          // a few glyphs flicker ahead of the ink
          const preview = [...shown];
          for (let k = done; k < Math.min(order.length, done + 14); k++) preview[order[k]] = "#%*+=:"[(Math.random() * 6) | 0];
          el.textContent = preview.join("");
          if (done < order.length) raf = requestAnimationFrame(step);
          else el.textContent = text;
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <pre ref={ref} aria-hidden className={`font-mono leading-[1.15] text-bone ${className}`}>
      {text}
    </pre>
  );
}
