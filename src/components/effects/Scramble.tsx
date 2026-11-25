"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "#%&@$*+=/\\|<>-_01";

/**
 * Renders its text normally (so it is readable without JS), then decodes it
 * from random glyphs the first time it scrolls into view.
 */
export default function Scramble({
  text,
  className = "",
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "div";
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 700 + text.length * 18;
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const solved = Math.floor(p * text.length);
          let out = text.slice(0, solved);
          for (let i = solved; i < text.length; i++) {
            out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          el.textContent = out;
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden>
        {text}
      </span>
    </Tag>
  );
}
