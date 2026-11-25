"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Modal from "@/components/ui/Modal";

// The runner only downloads when someone clicks the sentry.
const HorseRunner = dynamic(() => import("@/components/games/HorseRunner"), { ssr: false });

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
  const [riding, setRiding] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % LEGS.length), 190);
    return () => window.clearInterval(id);
  }, []);

  const lines = [HEAD[0].replace("|>", PENNANT[frame]), ...HEAD.slice(1), ...LEGS[frame]];

  return (
    <>
      <div className={`pointer-events-none overflow-hidden ${className}`}>
        <button
          type="button"
          onClick={() => setRiding(true)}
          aria-label="Ride with the sentry: opens a horseback runner minigame"
          title="Ride with me"
          className="march pointer-events-auto inline-block cursor-pointer text-left text-ash transition-colors hover:text-parchment focus-visible:text-parchment"
        >
          <pre className="font-mono text-[10px] leading-[1.05] sm:text-[11px]" aria-hidden>
            {lines.join("\n")}
          </pre>
        </button>
      </div>
      <Modal open={riding} onClose={() => setRiding(false)} title="The Ride" label="Jump the barrels, duck the birds" wide>
        <HorseRunner />
      </Modal>
    </>
  );
}
