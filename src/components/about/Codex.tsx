import Image from "next/image";
import { profile, timeline } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import CourseMap from "./CourseMap";
import SqlConsole from "./SqlConsole";
import SecurityTrial from "./SecurityTrial";

export default function Codex() {
  return (
    <section id="codex" aria-labelledby="codex-title" className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <SectionHeading
        id="codex-title"
        numeral="I"
        label="The Codex"
        title="A chronicle of study & craft"
        kicker="Who I am, where I trained, and the coursework that shaped how I build. Two of the courses below have trials you can actually play."
      />

      {/* ---- Author plate + biography ---- */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <figure data-reveal className="engraved mx-auto w-full max-w-md self-start bg-crypt p-4">
          <div className="relative aspect-[520/528] overflow-hidden bg-void">
            <Image
              src="/images/portrait-dither.png"
              alt="Dithered portrait of Elijah Cortez, seated in a dark jacket"
              width={520}
              height={528}
              unoptimized
              className="h-full w-full object-cover [image-rendering:pixelated]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
          </div>
          <figcaption className="label mt-3 flex justify-between">
            <span>Fig. II — The Author</span>
            <span className="text-ash-dim">1-bit · Atkinson</span>
          </figcaption>
        </figure>

        <div>
          <div data-reveal className="space-y-6 text-xl leading-[1.65] text-bone md:text-[1.4rem]">
            <p className="dropcap">
              Engineer by training, designer by instinct: I&apos;m Elijah Cortez, a software engineer in Los Angeles
              who earned a B.S. in Computer Science from California State University, Northridge in May 2026. I build full-stack web and mobile products,
              most recently <em>Toro Campus Connect</em>, a student community hub that took first place at CSUN&apos;s
              2026 Senior Project Showcase.
            </p>
            <p className="text-ash">
              I work where engineering meets design. More than a decade of digital art shapes how I approach
              interfaces, and coursework in database design, networks &amp; security, operating systems and data mining
              shapes how I build what&apos;s underneath them.
            </p>
          </div>

          <dl data-reveal className="mt-12 grid gap-px overflow-hidden border border-[var(--rule)] bg-[var(--rule)] font-mono text-xs sm:grid-cols-2">
            {[
              ["Degree", `${profile.degree.title}, ${profile.degree.short}`],
              ["Conferred", profile.degree.conferred],
              ["Award", profile.award.title],
              ["Honors", profile.honors.join(" · ")],
              ["Currently", `${profile.work.role}, ${profile.work.org}`],
              ["Since", profile.work.span],
            ].map(([k, v]) => (
              <div key={k} className="bg-void p-4">
                <dt className="label mb-1.5 text-ash-dim">{k}</dt>
                <dd className={`leading-relaxed ${k === "Award" ? "text-gilt" : "text-bone"}`}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ---- Chronicle ---- */}
      <div className="mt-28">
        <h3 className="label mb-8 flex items-center gap-3">
          <span className="text-bone">✠</span> The Chronicle
        </h3>
        <ol data-reveal-lines className="relative grid gap-6 border-l border-[var(--rule)] pl-6 md:grid-cols-7 md:gap-4 md:border-l-0 md:border-t md:pl-0 md:pt-8">
          {timeline.map((e) => (
            <li key={e.when + e.what} className="relative">
              <span
                className="absolute -left-[27.5px] top-1.5 h-2 w-2 rotate-45 border border-bone bg-void md:-top-[37px] md:left-0"
                aria-hidden
              />
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash">{e.when}</p>
              <p className="mt-2 font-serif text-lg leading-snug text-parchment">{e.what}</p>
              {e.note && <p className="mt-1 text-sm leading-snug text-ash">{e.note}</p>}
            </li>
          ))}
        </ol>
      </div>

      {/* ---- Campaign map of courses ---- */}
      <div className="mt-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h3 className="label mb-4 flex items-center gap-3">
              <span className="text-bone">✠</span> The Campaign · CSUN coursework
            </h3>
            <p className="max-w-xl font-serif text-3xl leading-tight text-parchment md:text-4xl">
              Six terms, mapped. Pick a school to trace a path, or a seal to read it.
            </p>
          </div>
        </div>
        <CourseMap />
      </div>

      {/* ---- Trials ---- */}
      <div className="mt-32">
        <h3 className="label mb-4 flex items-center gap-3">
          <span className="text-bone">✠</span> The Trials
        </h3>
        <p className="mb-10 max-w-2xl font-serif text-3xl leading-tight text-parchment md:text-4xl">
          Two courses, made playable.
        </p>
        <div className="grid gap-8 xl:grid-cols-2">
          <SqlConsole />
          <SecurityTrial />
        </div>
      </div>
    </section>
  );
}
