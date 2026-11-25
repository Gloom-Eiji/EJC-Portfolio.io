"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, GitBranch } from "lucide-react";
import { projects } from "@/data/projects";
import { onOpenDossier } from "@/lib/archive-events";
import AsciiEmblem from "./AsciiEmblem";
import ProjectModal from "./ProjectModal";

export default function ArchiveGallery() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => onOpenDossier((id) => window.setTimeout(() => setOpenId(id), 450)), []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const viewport = viewportRef.current!;
      const track = trackRef.current!;
      viewport.classList.add("is-pinned");
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${s.progress})`;
            if (counterRef.current) {
              const n = Math.min(projects.length, Math.round(s.progress * (projects.length - 1)) + 1);
              counterRef.current.textContent = String(n).padStart(2, "0");
            }
          },
        },
      });
      return () => viewport.classList.remove("is-pinned");
    });
    return () => mm.revert();
  }, []);

  const open = projects.find((p) => p.id === openId) ?? null;

  return (
    <>
      <div ref={viewportRef} className="archive-viewport no-scrollbar relative lg:flex lg:min-h-dvh lg:flex-col lg:justify-center lg:pt-16">
        <div className="mx-auto mb-6 hidden w-full max-w-[1400px] items-center gap-6 px-10 motion-safe:lg:flex" aria-hidden>
          <span className="label text-bone">
            Folio <span ref={counterRef}>01</span> / {String(projects.length).padStart(2, "0")}
          </span>
          <div className="h-px flex-1 bg-[var(--rule)]">
            <div ref={barRef} className="h-px origin-left scale-x-0 bg-bone" />
          </div>
          <span className="label">Scroll to turn the pages →</span>
        </div>

        <div ref={trackRef} className="archive-track flex flex-col gap-8 px-5 md:px-10 lg:gap-10 lg:motion-safe:flex-row">
          {projects.map((p) => (
            <article
              key={p.id}
              aria-labelledby={`proj-${p.id}`}
              className="archive-panel engraved group relative grid overflow-hidden bg-crypt md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
            >
              <span
                className="pointer-events-none absolute -right-4 -top-10 select-none font-blackletter text-[11rem] leading-none text-bone/[0.04] md:text-[16rem]"
                aria-hidden
              >
                {p.numeral}
              </span>

              <div className="relative flex items-center justify-center overflow-hidden border-b border-[var(--rule)] bg-void px-4 py-10 md:border-b-0 md:border-r md:py-14">
                <AsciiEmblem art={p.emblem} className="text-[0.5rem] sm:text-[0.62rem] xl:text-[0.72rem]" />
                <span className="label absolute bottom-3 left-4 text-ash-dim">Plate {p.numeral}</span>
              </div>

              <div className="relative flex flex-col p-6 md:p-10">
                <div className="label flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-bone">No. {p.numeral}</span>
                  <span>{p.category}</span>
                  {p.timeframe && <span className="text-ash-dim">{p.timeframe}</span>}
                </div>
                <h3 id={`proj-${p.id}`} className="mt-5 font-serif text-4xl font-medium leading-[0.95] text-parchment md:text-6xl">
                  {p.title}
                </h3>
                {p.award && (
                  <p className="mt-4 inline-flex items-center gap-2 self-start border border-gilt/50 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gilt">
                    ✦ {p.award}
                  </p>
                )}
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-ash md:text-xl">{p.summary}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology">
                  {p.stack.slice(0, 6).map((s) => (
                    <li key={s} className="tag">
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                  <button
                    type="button"
                    onClick={() => setOpenId(p.id)}
                    className="border border-bone px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-bone hover:text-void"
                  >
                    Open dossier
                  </button>
                  {p.links[0] && (
                    <a
                      href={p.links[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ash transition-colors hover:text-bone"
                    >
                      <GitBranch size={14} strokeWidth={1.4} aria-hidden /> {p.links[0].label}
                      <ArrowUpRight size={13} strokeWidth={1.4} aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
          <div className="hidden w-[10vw] shrink-0 motion-safe:lg:block" aria-hidden />
        </div>
      </div>

      <ProjectModal project={open} onClose={() => setOpenId(null)} />
    </>
  );
}
