"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in
 * sync. Also animates every `[data-reveal]` element as it enters the viewport.
 * Both are skipped entirely for visitors who prefer reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -64 }, autoRaf: false });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0);
        gsap.from(el, {
          y: 28,
          opacity: 0,
          filter: "blur(4px)",
          duration: 1.1,
          delay,
          ease: "power3.out",
          clearProps: "filter",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal-lines] > *").forEach((el, i) => {
        gsap.from(el, {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: (i % 8) * 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}
