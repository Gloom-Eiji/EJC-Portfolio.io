"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, FlaskConical, Gem, Hammer, Shield, Sword, X, type LucideIcon } from "lucide-react";
import { categories, skills, type SkillCategory } from "@/data/skills";
import { lesserWorks, projects } from "@/data/projects";
import { goToWork } from "@/lib/archive-events";

const ICONS: Record<SkillCategory, LucideIcon> = {
  weapons: Sword,
  armor: Shield,
  relics: Gem,
  alchemy: FlaskConical,
  tools: Hammer,
};

const MAX_LOADOUT = 3;

export default function Armory() {
  const [cat, setCat] = useState<SkillCategory>("weapons");
  const [selectedId, setSelectedId] = useState("python");
  const [loadout, setLoadout] = useState<string[]>([]);

  const items = skills.filter((s) => s.category === cat);
  const item = skills.find((s) => s.id === selectedId) ?? items[0];
  const catMeta = categories.find((c) => c.id === item.category)!;
  const Icon = ICONS[item.category];

  const matches = useMemo(() => {
    if (!loadout.length) return [];
    return [...projects, ...lesserWorks].filter((p) =>
      loadout.every((id) => skills.find((s) => s.id === id)?.projects?.includes(p.id)),
    );
  }, [loadout]);

  const toggleEquip = (id: string) =>
    setLoadout((l) => (l.includes(id) ? l.filter((x) => x !== id) : l.length >= MAX_LOADOUT ? l : [...l, id]));

  return (
    <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)_minmax(0,24rem)]">
      {/* Categories */}
      <div role="group" aria-label="Armory categories" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:px-0">
        {categories.map((c) => {
          const CIcon = ICONS[c.id];
          const active = c.id === cat;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setCat(c.id);
                setSelectedId(skills.find((s) => s.category === c.id)!.id);
              }}
              className={`group flex shrink-0 items-center gap-3 border px-4 py-3 text-left transition-colors lg:w-full ${
                active ? "border-bone bg-bone text-void" : "border-[var(--rule)] text-ash hover:border-[var(--rule-strong)] hover:text-bone"
              }`}
            >
              <CIcon size={16} strokeWidth={1.3} aria-hidden />
              <span>
                <span className="block font-serif text-lg leading-none">{c.name}</span>
                <span className={`mt-1 hidden font-mono text-[0.6rem] uppercase tracking-wider lg:block ${active ? "text-void/60" : "text-ash-dim"}`}>
                  {c.meaning}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Inventory grid */}
      <div className="engraved bg-crypt/60 p-4 md:p-5">
        <div className="label mb-4 flex justify-between">
          <span className="text-bone">{categories.find((c) => c.id === cat)!.meaning}</span>
          <span className="text-ash-dim">
            {items.length} slot{items.length === 1 ? "" : "s"}
          </span>
        </div>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
          {items.map((s) => {
            const isSel = s.id === item.id;
            const equipped = loadout.includes(s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  aria-pressed={isSel}
                  aria-label={`${s.name}${equipped ? " (equipped)" : ""}`}
                  className={`group relative flex aspect-square w-full flex-col items-center justify-center gap-2 border transition-all duration-300 ${
                    isSel ? "border-bone bg-iron" : "border-[var(--rule)] bg-void hover:border-[var(--rule-strong)] hover:bg-iron/60"
                  }`}
                >
                  {isSel && (
                    <>
                      <span className="absolute left-1 top-1 h-2 w-2 border-l border-t border-bone" aria-hidden />
                      <span className="absolute bottom-1 right-1 h-2 w-2 border-b border-r border-bone" aria-hidden />
                    </>
                  )}
                  {equipped && (
                    <span className="absolute right-1.5 top-1 font-mono text-[0.6rem] text-gilt" aria-hidden>
                      ✦
                    </span>
                  )}
                  <span
                    className={`font-mono text-xl transition-transform duration-300 group-hover:-translate-y-0.5 md:text-2xl ${
                      isSel ? "text-parchment" : "text-bone"
                    }`}
                    aria-hidden
                  >
                    {s.sigil}
                  </span>
                  <span className="px-1 text-center font-mono text-[0.58rem] uppercase leading-tight tracking-wider text-ash">
                    {s.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Loadout */}
        <div className="mt-6 border-t border-[var(--rule)] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="label">
              <span className="text-bone">Loadout</span> · equip up to {MAX_LOADOUT} to find the quests that used them
            </p>
            {loadout.length > 0 && (
              <button type="button" onClick={() => setLoadout([])} className="label hover:text-bone">
                Clear
              </button>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            {Array.from({ length: MAX_LOADOUT }).map((_, i) => {
              const s = skills.find((x) => x.id === loadout[i]);
              return s ? (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleEquip(s.id)}
                  aria-label={`Unequip ${s.name}`}
                  className="group flex h-12 min-w-16 items-center justify-center gap-2 border border-gilt/60 px-3 font-mono text-sm text-parchment"
                >
                  {s.sigil}
                  <X size={12} className="text-ash group-hover:text-bone" aria-hidden />
                </button>
              ) : (
                <span key={i} className="flex h-12 min-w-16 items-center justify-center border border-dashed border-[var(--rule)] font-mono text-xs text-ash-dim" aria-hidden>
                  ·
                </span>
              );
            })}
          </div>
          <div className="mt-4 min-h-[2.5rem]" aria-live="polite">
            {loadout.length === 0 ? (
              <p className="text-base text-ash-dim">Your hands are empty. Select an item and press Equip.</p>
            ) : matches.length ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="label text-gilt">Quests matched</span>
                {matches.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => goToWork(p.id)}
                    className="inline-flex items-center gap-1.5 border border-[var(--rule-strong)] px-3 py-1.5 font-mono text-xs text-bone transition-colors hover:bg-bone hover:text-void"
                  >
                    {p.title} <ArrowUpRight size={13} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-base text-ash">No single quest has called for all of these. Yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Item card */}
      <div className="lg:sticky lg:top-24 lg:self-start" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="engraved bg-crypt p-6"
          >
            <div className="flex items-start justify-between">
              <p className="label flex items-center gap-2">
                <Icon size={13} strokeWidth={1.4} aria-hidden /> {catMeta.name.replace(/s$/, "")} · {catMeta.meaning}
              </p>
            </div>
            <div className="mt-6 flex items-end gap-5">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center border border-[var(--rule-strong)] font-mono text-3xl text-parchment" aria-hidden>
                {item.sigil}
              </span>
              <h3 className="font-serif text-4xl leading-none text-parchment">{item.name}</h3>
            </div>
            <p className="mt-6 font-serif text-xl italic leading-relaxed text-bone">&ldquo;{item.lore}&rdquo;</p>

            {item.courses?.length ? (
              <div className="mt-6">
                <p className="label mb-2 text-ash-dim">Forged in</p>
                <div className="flex flex-wrap gap-2">
                  {item.courses.map((c) => (
                    <span key={c} className="tag">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {item.projects?.length ? (
              <div className="mt-5">
                <p className="label mb-2 text-ash-dim">Wielded in</p>
                <ul className="space-y-1.5">
                  {item.projects.map((id) => {
                    const p = [...projects, ...lesserWorks].find((x) => x.id === id);
                    return p ? (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => goToWork(id)}
                          className="group flex w-full items-center justify-between border-b border-[var(--rule)] py-2 text-left font-serif text-lg text-bone hover:text-parchment"
                        >
                          {p.title}
                          <ArrowUpRight size={15} strokeWidth={1.3} className="text-ash transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </button>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => toggleEquip(item.id)}
              disabled={!loadout.includes(item.id) && loadout.length >= MAX_LOADOUT}
              className={`mt-7 w-full border px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                loadout.includes(item.id)
                  ? "border-gilt/70 text-gilt hover:bg-gilt hover:text-void"
                  : "border-bone text-bone hover:bg-bone hover:text-void"
              }`}
            >
              {loadout.includes(item.id) ? "Unequip" : loadout.length >= MAX_LOADOUT ? "Loadout full" : "Equip"}
            </button>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
