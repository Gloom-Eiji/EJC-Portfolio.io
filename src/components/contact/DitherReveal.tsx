"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** The dithered duel opens like a slit in a visor as the section scrolls in. */
export default function DitherReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(46% 0% 46% 0%)", opacity: 0.2 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 95%", end: "center 55%", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="relative">
      <Image
        src="/images/KnightDuel.png"
        alt="Dithered engraving of two armored knights locked in a duel"
        width={736}
        height={491}
        unoptimized
        className="h-72 w-full object-cover opacity-60 [image-rendering:pixelated] sm:h-auto"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-transparent to-void" />
    </div>
  );
}
