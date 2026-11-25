import { profile } from "@/data/profile";
import AsciiKnight from "./AsciiKnight";
import MarchingKnight from "./MarchingKnight";

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-name" className="relative flex min-h-dvh flex-col overflow-hidden pt-16">
      {/* faint engraved frame */}
      <div className="pointer-events-none absolute inset-4 border border-[var(--rule)] md:inset-6" aria-hidden />
      <div className="label pointer-events-none absolute left-8 top-20 hidden md:block" aria-hidden>
        Folio I — Liber Operum
      </div>
      <div className="label pointer-events-none absolute right-8 top-20 hidden text-right md:block" aria-hidden>
        34.05° N · 118.24° W
      </div>

      <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-6 px-5 pb-24 pt-10 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
        <div className="relative z-10">
          <p className="label mb-6 flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 animate-pulse bg-bone" aria-hidden />
            {profile.degree.short} · {profile.degree.title} · {profile.degree.conferred}
          </p>

          <h1
            id="hero-name"
            className="font-blackletter text-[clamp(3.6rem,11vw,9.5rem)] leading-[0.86] text-parchment"
          >
            <span className="block">Elijah</span>
            <span className="block pl-[0.6em]">Cortez</span>
          </h1>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.32em] text-bone md:text-sm">
            {profile.roles.join(" / ")}
          </p>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ash md:text-xl">
            Full-stack web &amp; mobile engineer with a designer&apos;s eye. My capstone,{" "}
            <a href="#archives" className="text-bone underline decoration-[var(--rule-strong)] underline-offset-4 hover:decoration-bone">
              Toro Campus Connect
            </a>
            , took first place at CSUN&apos;s 2026 Senior Project Showcase.
          </p>

          <dl className="mt-10 grid max-w-lg grid-cols-1 gap-x-8 sm:grid-cols-2 gap-y-4 border-t border-[var(--rule)] pt-6 font-mono text-xs">
            <div>
              <dt className="label mb-1 text-ash-dim">Based in</dt>
              <dd className="text-bone">{profile.location}</dd>
            </div>
            <div>
              <dt className="label mb-1 text-ash-dim">Honors</dt>
              <dd className="text-bone">Showcase 1st · Dean&apos;s List ×2</dd>
            </div>
            <div>
              <dt className="label mb-1 text-ash-dim">Correspondence</dt>
              <dd>
                <a href={`mailto:${profile.email}`} className="link-underline text-bone">
                  {profile.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label mb-1 text-ash-dim">Repository</dt>
              <dd>
                <a href={profile.github.href} target="_blank" rel="noopener noreferrer" className="link-underline text-bone">
                  {profile.github.label}
                </a>
              </dd>
            </div>
            {profile.availability && (
              <div className="sm:col-span-2">
                <dt className="label mb-1 text-ash-dim">Status</dt>
                <dd className="text-bone">{profile.availability}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[min(520px,82vw)] lg:max-w-[600px]">
          <AsciiKnight />
          <p className="label mt-2 text-center text-ash-dim" aria-hidden>
            Fig. I — The Sentinel · <span className="text-bone">click him to duel</span>
          </p>
        </div>
      </div>

      <a
        href="#codex"
        className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 md:flex flex-col items-center gap-3 text-ash transition-colors hover:text-bone"
      >
        <span className="label">Descend</span>
        <span className="descend-line" aria-hidden />
      </a>

      <MarchingKnight className="absolute inset-x-0 bottom-6 hidden md:block" />
    </section>
  );
}
