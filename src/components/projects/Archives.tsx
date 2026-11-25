import { futureScope } from "@/data/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import ArchiveGallery from "./ArchiveGallery";

export default function Archives() {
  return (
    <section id="archives" aria-labelledby="archives-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          id="archives-title"
          numeral="III"
          label="The Archives"
          title="Works recorded in the archive"
          kicker="Selected projects across full-stack web, mobile, automation and games. Open a dossier for the full account."
        />
      </div>

      <ArchiveGallery />

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
