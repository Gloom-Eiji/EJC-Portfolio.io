"use client";

import { useEffect, useState } from "react";

const LINES = [
  "> unsealing the codex ............ ok",
  "> polishing armor ................ ok",
  "> lighting the torches ........... ok",
  "> the archive is open.",
];

/**
 * A ~1.3s terminal boot. It fades out by itself through CSS, so even if
 * JavaScript never runs it cannot hide the page. Any click or key skips it.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const skip = () => setDone(true);
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    const t = window.setTimeout(skip, 1900);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className={`preloader ${done ? "is-done" : ""}`} aria-hidden>
      <div className="w-[min(88vw,26rem)] font-mono text-xs leading-6 text-ash">
        {LINES.map((l, i) => (
          <div key={l} className="preloader-line" style={{ animationDelay: `${0.12 + i * 0.24}s` }}>
            {l}
          </div>
        ))}
        <div className="mt-4 h-px w-full overflow-hidden bg-[var(--rule)]">
          <div
            className="h-full bg-bone"
            style={{ animation: "preload-bar 1.1s cubic-bezier(.22,1,.36,1) forwards", width: 0 }}
          />
        </div>
        <style>{`@keyframes preload-bar{to{width:100%}}`}</style>
      </div>
    </div>
  );
}
