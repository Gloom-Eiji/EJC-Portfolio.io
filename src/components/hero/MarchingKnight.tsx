"use client";

import { useEffect, useState } from "react";

// A small sentry that patrols the bottom of a section. The CSS `march`
// animation moves and mirrors it; this component only cycles the walk frames.
const HEAD = [
  String.raw`    _,_     |>`,
  String.raw`   [=__]    |`,
  String.raw`   _|##|____|`,
  String.raw`  (_|##|    |`,
  String.raw`    |__|    |`,
];
const LEGS = [
  [String.raw`    /  \    |`, String.raw`   /    \    `],
  [String.raw`    /  |    |`, String.raw`   /   _|    `],
  [String.raw`    |  |    |`, String.raw`   _|  _|    `],
  [String.raw`    |  \    |`, String.raw`   _|   \    `],
];
const PENNANT = ["|>", "|~", "|-", "|~"];

export default function MarchingKnight({ className = "" }: { className?: string }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % LEGS.length), 190);
    return () => window.clearInterval(id);
  }, []);

  const lines = [HEAD[0].replace("|>", PENNANT[frame]), ...HEAD.slice(1), ...LEGS[frame]];

  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <pre className="march inline-block font-mono text-[10px] leading-[1.05] text-ash sm:text-[11px]">
        {lines.join("\n")}
      </pre>
    </div>
  );
}
