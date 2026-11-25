import { ArrowUpRight, FileText, GitBranch, Mail, Briefcase } from "lucide-react";
import { profile } from "@/data/profile";
import MarchingKnight from "@/components/hero/MarchingKnight";
import Scramble from "@/components/effects/Scramble";
import CopyEmail from "./CopyEmail";
import DitherReveal from "./DitherReveal";

export default function Contact() {
  const channels = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail, external: false },
    { label: "LinkedIn", value: profile.linkedin.label, href: profile.linkedin.href, icon: Briefcase, external: true },
    { label: "GitHub", value: profile.github.label, href: profile.github.href, icon: GitBranch, external: true },
    { label: "Résumé", value: "PDF · 2026", href: profile.resume, icon: FileText, external: true },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pt-28 md:pt-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="label flex items-center gap-3">
          <span className="text-bone">§ IV</span>
          <span className="h-px w-10 bg-[var(--rule-strong)]" />
          <Scramble text="Correspondence" />
        </div>

        <div className="relative mt-10">
          <DitherReveal />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h2
              id="contact-title"
              className="font-blackletter text-[clamp(2.6rem,8vw,7.5rem)] leading-[0.95] text-parchment [text-shadow:0_0_40px_#050505,0_0_12px_#050505]"
            >
              The work is never finished.
            </h2>
          </div>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div data-reveal>
            <p className="text-2xl leading-relaxed text-bone md:text-3xl">
              Looking for an engineer for your team? Send word. I read every letter.
            </p>
            {profile.availability && <p className="label mt-6 text-gilt">✦ {profile.availability}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="border border-bone bg-bone px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-void transition-colors hover:bg-transparent hover:text-bone"
              >
                Send a letter
              </a>
              <CopyEmail email={profile.email} />
            </div>
          </div>

          <ul className="border-t border-[var(--rule)]" data-reveal-lines>
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--rule)] py-5 transition-colors hover:bg-iron/40 md:grid-cols-[2.5rem_9rem_minmax(0,1fr)_auto] md:px-2"
                >
                  <c.icon size={16} strokeWidth={1.3} className="text-ash group-hover:text-bone" aria-hidden />
                  <span className="label hidden md:inline">{c.label}</span>
                  <span className="truncate font-serif text-lg text-parchment sm:text-xl md:text-2xl">{c.value}</span>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.3}
                    className="text-ash transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                    aria-hidden
                  />
                  {c.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="relative mt-32 border-t border-[var(--rule)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-8 pb-24 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ash-dim md:flex-row md:items-center md:justify-between md:px-10">
          <span>© MMXXVI Elijah Cortez</span>
          <span>Set in UnifrakturCook, Cormorant &amp; Plex Mono · Built with Next.js · Hosted on Vercel</span>
          <a href="#top" className="link-underline self-start text-ash hover:text-bone md:self-auto">
            Ascend ↑
          </a>
        </div>
        <MarchingKnight className="absolute inset-x-0 bottom-3" />
      </footer>
    </section>
  );
}
