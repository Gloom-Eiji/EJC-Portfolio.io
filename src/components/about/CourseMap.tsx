"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { courses, domains, terms, type Domain } from "@/data/courses";
import { findWork } from "@/data/projects";
import { goToWork } from "@/lib/archive-events";

const DOMAIN_GLYPH: Record<Domain, string> = {
  data: "≡",
  security: "◈",
  systems: "▣",
  web: "◫",
  theory: "∴",
  engineering: "△",
};

export default function CourseMap() {
  const [filter, setFilter] = useState<Domain | "all">("all");
  const [selected, setSelected] = useState("COMP 440");

  const course = courses.find((c) => c.code === selected) ?? courses[0];
  const counts = useMemo(() => {
    const m = {} as Record<Domain, number>;
    for (const c of courses) m[c.domain] = (m[c.domain] ?? 0) + 1;
    return m;
  }, []);
  const totalUnits = courses.reduce((s, c) => s + c.units, 0);

  return (
    <div>
      {/* Schools (filters) */}
      <div role="group" aria-label="Filter courses by school" className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All schools <span className="text-ash-dim">{courses.length}</span>
        </FilterChip>
        {(Object.keys(domains) as Domain[]).map((d) => (
          <FilterChip key={d} active={filter === d} onClick={() => setFilter(d)}>
            <span aria-hidden>{DOMAIN_GLYPH[d]}</span> {domains[d].label}{" "}
            <span className="text-ash-dim">{counts[d]}</span>
          </FilterChip>
        ))}
      </div>

      {/* The map */}
      <div className="engraved relative bg-crypt/60 p-4 md:p-6">
        <div className="label mb-5 flex justify-between text-ash-dim">
          <span>Fall 2023 → Spring 2026</span>
          <span>
            {courses.length} upper-division seals · {totalUnits} units
          </span>
        </div>
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-3">
          {terms.map((term, ti) => {
            const list = courses.filter((c) => c.term === term);
            return (
              <li key={term} className="relative">
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono text-[0.65rem] text-ash-dim">{String(ti + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-bone">{term}</span>
                  {(term === "Fall 2024" || term === "Fall 2025") && (
                    <span className="ml-auto font-mono text-[0.6rem] uppercase tracking-wider text-gilt" title="Dean's List">
                      ✦ Dean&apos;s List
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {list.map((c) => {
                    const dim = filter !== "all" && c.domain !== filter;
                    const isSel = c.code === selected;
                    return (
                      <li key={c.code}>
                        <button
                          type="button"
                          onClick={() => setSelected(c.code)}
                          aria-pressed={isSel}
                          className={`group relative w-full border px-3 py-2.5 text-left transition-all duration-300 ${
                            isSel
                              ? "border-bone bg-bone text-void"
                              : "border-[var(--rule)] bg-void hover:border-[var(--rule-strong)]"
                          } ${dim ? "opacity-25" : "opacity-100"}`}
                        >
                          <span className={`flex items-center justify-between font-mono text-[0.65rem] tracking-wider ${isSel ? "text-void/70" : "text-ash"}`}>
                            <span>
                              <span aria-hidden className="mr-1">{DOMAIN_GLYPH[c.domain]}</span>
                              {c.code}
                            </span>
                            {c.featured && <span aria-label="highlight">✦</span>}
                          </span>
                          <span className={`mt-1 block font-serif text-[1.05rem] leading-tight ${isSel ? "text-void" : "text-parchment"}`}>
                            {c.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The selected seal */}
      <div className="mt-6 min-h-[13rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.article
            key={course.code}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 border-t border-[var(--rule)] pt-6 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
          >
            <div>
              <p className="label text-ash">
                {course.code} · {course.term} · {course.units} units
              </p>
              <h4 className="mt-2 font-serif text-4xl leading-none text-parchment">{course.title}</h4>
              <p className="label mt-3 text-ash-dim">
                {DOMAIN_GLYPH[course.domain]} {domains[course.domain].school}
              </p>
            </div>
            <div>
              <p className="text-xl leading-relaxed text-bone">{course.topics}</p>
              {course.projects?.length ? (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="label">Applied in</span>
                  {course.projects.map((id) => {
                    const p = findWork(id);
                    return p ? (
                      <button
                        key={id}
                        type="button"
                        onClick={() => goToWork(id)}
                        className="group inline-flex items-center gap-1.5 border border-[var(--rule-strong)] px-3 py-1.5 font-mono text-xs text-bone transition-colors hover:bg-bone hover:text-void"
                      >
                        {p.title}
                        <ArrowUpRight size={13} strokeWidth={1.5} />
                      </button>
                    ) : null;
                  })}
                </div>
              ) : null}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 border px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${
        active ? "border-bone bg-bone text-void" : "border-[var(--rule)] text-ash hover:border-[var(--rule-strong)] hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}
