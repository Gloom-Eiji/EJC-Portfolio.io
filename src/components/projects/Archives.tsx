import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { futureScope, lesserWorks } from "@/data/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import ArchiveGallery from "./ArchiveGallery";
import GithubLedger from "./GithubLedger";

export default function Archives() {
  return (
    <section id="archives" aria-labelledby="archives-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          id="archives-title"
          numeral="III"
          label="The Archives"
          title="Works recorded in the archive"
          kicker="Four featured works across full-stack web, mobile and games. Open a dossier for the full account. Smaller works and my GitHub activity follow."
        />
      </div>

      <ArchiveGallery />

      <div className="mx-auto mt-32 max-w-[1400px] px-5 md:px-10">
        <h3 className="label mb-4 flex items-center gap-3">
          <span className="text-bone">✠</span> Lesser works · course projects &amp; tools
        </h3>
        <p className="mb-10 max-w-2xl font-serif text-3xl leading-tight text-parchment md:text-4xl">
          Smaller pieces, still worth a look.
        </p>

        <ol className="border-t border-[var(--rule)]" data-reveal-lines>
          {lesserWorks.map((w, i) => (
            <li
              key={w.id}
              id={`work-${w.id}`}
              className="grid scroll-mt-28 gap-3 border-b border-[var(--rule)] py-6 transition-colors md:grid-cols-[3rem_minmax(0,16rem)_minmax(0,1fr)_auto] md:items-baseline md:gap-8"
            >
              <span className="font-mono text-xs text-ash-dim">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="font-serif text-2xl leading-tight text-parchment">{w.title}</h4>
                <p className="label mt-1.5 text-ash-dim">
                  {w.kind}
                  {w.when ? ` · ${w.when}` : ""}
                </p>
              </div>
              <div>
                <p className="text-lg leading-relaxed text-ash">{w.text}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technology">
                  {w.stack.map((s) => (
                    <li key={s} className="tag">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4 md:justify-end">
                {w.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label link-underline inline-flex items-center gap-1 text-bone"
                  >
                    {l.label} <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16">
          <Suspense fallback={<div className="engraved h-56 bg-crypt/60" aria-hidden />}>
            <GithubLedger />
          </Suspense>
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-[1400px] px-5 md:px-10">
        <h3 className="label mb-4 flex items-center gap-3">
          <span className="text-bone">✠</span> Oaths yet sworn · future scope
        </h3>
        <p className="mb-10 max-w-2xl font-serif text-3xl leading-tight text-parchment md:text-4xl">
          What I intend to build next.
        </p>
        <ol data-reveal-lines className="grid gap-px border border-[var(--rule)] bg-[var(--rule)] md:grid-cols-3">
          {futureScope.map((f, i) => (
            <li key={f.title} className="bg-void p-6 md:p-8">
              <p className="label flex justify-between">
                <span>{f.kind}</span>
                <span className="text-ash-dim">Oath {["I", "II", "III"][i]}</span>
              </p>
              <h4 className="mt-6 font-serif text-3xl leading-tight text-parchment">{f.title}</h4>
              <p className="mt-3 text-lg leading-relaxed text-ash">{f.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
