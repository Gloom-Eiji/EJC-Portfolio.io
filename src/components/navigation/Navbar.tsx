"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#codex", label: "Codex", numeral: "I" },
  { href: "#armory", label: "Armory", numeral: "II" },
  { href: "#archives", label: "Archives", numeral: "III" },
  { href: "#contact", label: "Contact", numeral: "IV" },
];

export default function Navbar({ resume }: { resume: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const l of LINKS) {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "border-b border-[var(--rule)] bg-void/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="group flex items-baseline gap-3" aria-label="Elijah Cortez — back to top">
          <span className="font-blackletter text-2xl text-parchment transition-opacity group-hover:opacity-70">EC</span>
          <span className="label hidden sm:inline">Folio · MMXXVI</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? "location" : undefined}
                className={`label link-underline pb-1 transition-colors hover:text-bone ${
                  active === l.href ? "text-bone" : ""
                }`}
              >
                <span className="mr-1.5 text-ash-dim">{l.numeral}.</span>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              className="label border border-[var(--rule-strong)] px-3 py-2 text-bone transition-colors hover:bg-bone hover:text-void"
            >
              Résumé
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="p-2 text-bone md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} strokeWidth={1.25} /> : <Menu size={20} strokeWidth={1.25} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[var(--rule)] md:hidden"
          >
            <ul className="flex flex-col px-5 py-6">
              {[...LINKS, { href: resume, label: "Résumé", numeral: "V" }].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    {...(l.href.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-baseline gap-4 border-b border-[var(--rule)] py-4 font-serif text-3xl text-parchment"
                  >
                    <span className="label w-6">{l.numeral}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
