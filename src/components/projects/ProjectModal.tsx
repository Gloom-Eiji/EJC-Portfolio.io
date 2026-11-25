"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/data/projects";
import AsciiEmblem from "./AsciiEmblem";

export default function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const meta: [string, string][] = [];
  if (project) {
    for (const [k, v] of [
      ["Timeframe", project.timeframe],
      ["Role", project.role],
      ["Team", project.team],
      ["Course", project.course],
    ] as const) {
      if (v) meta.push([k, v]);
    }
  }

  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    window.__lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      window.__lenis?.start();
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[70] flex justify-end bg-void/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dossier-title"
            data-lenis-prevent
            className="relative h-full w-full max-w-3xl overflow-y-auto border-l border-[var(--rule-strong)] bg-crypt"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--rule)] bg-crypt/90 px-6 py-4 backdrop-blur md:px-10">
              <span className="label">
                Dossier · No. {project.numeral} · {project.category}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close dossier"
                className="p-1.5 text-ash transition-colors hover:text-bone"
              >
                <X size={20} strokeWidth={1.2} />
              </button>
            </div>

            <div className="px-6 py-10 md:px-10 md:py-14">
              <h2 id="dossier-title" className="font-serif text-5xl font-medium leading-[0.95] text-parchment md:text-7xl">
                {project.title}
              </h2>
              {project.award && (
                <p className="mt-6 inline-flex items-center gap-2 border border-gilt/50 px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gilt">
                  ✦ {project.award}
                </p>
              )}

              {meta.length > 0 && (
                <dl className="mt-10 grid grid-cols-2 gap-px border border-[var(--rule)] bg-[var(--rule)] font-mono text-xs md:grid-cols-4">
                  {meta.map(([k, v]) => (
                    <div key={k} className="bg-crypt p-4">
                      <dt className="label mb-1 text-ash-dim">{k}</dt>
                      <dd className="text-bone">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {project.images?.length ? (
                <div className="mt-10 grid gap-4">
                  {project.images.map((img) => (
                    <figure key={img.src} className="engraved bg-void p-2">
                      <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="h-auto w-full" />
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="mt-10 flex justify-center overflow-hidden border border-[var(--rule)] bg-void px-4 py-8">
                  <AsciiEmblem art={project.emblem} className="text-[0.5rem] sm:text-[0.65rem]" />
                </div>
              )}

              <section className="mt-12" aria-labelledby="dossier-overview">
                <h3 id="dossier-overview" className="label mb-4 text-bone">
                  ✠ Account
                </h3>
                <div className="space-y-5 text-xl leading-relaxed text-bone">
                  {project.overview.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </section>

              {project.highlights.length > 0 && (
              <section className="mt-12" aria-labelledby="dossier-deeds">
                <h3 id="dossier-deeds" className="label mb-4 text-bone">
                  ✠ Deeds
                </h3>
                <ul className="space-y-3">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-4 border-b border-[var(--rule)] pb-3 text-lg leading-snug text-ash">
                      <span className="font-mono text-bone" aria-hidden>
                        †
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
              )}

              {project.stack.length > 0 && (
              <section className="mt-12" aria-labelledby="dossier-stack">
                <h3 id="dossier-stack" className="label mb-4 text-bone">
                  ✠ Arms carried
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li key={s} className="tag text-bone">
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
              )}

              {project.links.length > 0 && (
                <section className="mt-12" aria-labelledby="dossier-links">
                  <h3 id="dossier-links" className="label mb-4 text-bone">
                    ✠ Seals &amp; sources
                  </h3>
                  <ul>
                    {project.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between border-b border-[var(--rule)] py-4 font-serif text-2xl text-parchment transition-colors hover:text-bone"
                        >
                          {l.label}
                          <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider text-ash">
                            {new URL(l.href).hostname.replace("www.", "")}
                            <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </span>
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <button
                type="button"
                onClick={onClose}
                className="label mt-14 border border-[var(--rule-strong)] px-5 py-3 text-bone transition-colors hover:bg-bone hover:text-void"
              >
                ← Return to the archives
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
