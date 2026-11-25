import Scramble from "@/components/effects/Scramble";

export default function SectionHeading({
  numeral,
  label,
  title,
  kicker,
  id,
}: {
  numeral: string;
  label: string;
  title: string;
  kicker?: string;
  id?: string;
}) {
  return (
    <header className="mb-14 md:mb-20">
      <div className="label flex items-center gap-3">
        <span className="text-bone">§ {numeral}</span>
        <span className="h-px w-10 bg-[var(--rule-strong)]" />
        <Scramble text={label} />
      </div>
      <h2
        id={id}
        data-reveal
        className="mt-6 font-serif text-5xl font-medium leading-[0.95] tracking-tight text-parchment md:text-7xl"
      >
        {title}
      </h2>
      {kicker && (
        <p data-reveal data-reveal-delay="0.1" className="mt-5 max-w-2xl text-lg leading-relaxed text-ash md:text-xl">
          {kicker}
        </p>
      )}
    </header>
  );
}
