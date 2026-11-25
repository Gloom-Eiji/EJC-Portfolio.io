import { ArrowUpRight } from "lucide-react";
import { getContributions, getRecentPushes, type ContributionDay } from "@/lib/github";
import { profile } from "@/data/profile";

const USER = "Gloom-Eiji";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Level 0–4, from empty stone to bright bone.
const SHADE = [
  "bg-[rgba(208,204,196,0.05)]",
  "bg-[rgba(208,204,196,0.25)]",
  "bg-[rgba(208,204,196,0.45)]",
  "bg-[rgba(208,204,196,0.7)]",
  "bg-parchment",
];

function toWeeks(days: ContributionDay[]) {
  // Columns are weeks starting on Sunday; pad the first week so rows line up.
  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const cells: (ContributionDay | null)[] = [...Array(first).fill(null), ...days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function label(d: ContributionDay) {
  const date = new Date(d.date + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${d.count === 0 ? "No" : d.count} contribution${d.count === 1 ? "" : "s"} on ${date}`;
}

export default async function GithubLedger() {
  const [data, pushes] = await Promise.all([getContributions(USER), getRecentPushes(USER)]);

  return (
    <div className="engraved bg-crypt/60 p-5 md:p-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-bone">The Ledger of Commits</p>
          <p className="mt-2 font-serif text-2xl text-parchment md:text-3xl">
            {data ? (
              <>
                {data.total.toLocaleString("en-US")} contributions{" "}
                <span className="text-ash">in the last year</span>
              </>
            ) : (
              "Recent work on GitHub"
            )}
          </p>
        </div>
        <a
          href={profile.github.href}
          target="_blank"
          rel="noopener noreferrer"
          className="label link-underline inline-flex items-center gap-1.5 text-bone"
        >
          github.com/{USER} <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      {data ? (
        <>
          <div className="no-scrollbar overflow-x-auto pb-1" data-lenis-prevent>
            <Grid days={data.days} />
          </div>
          <div className="mt-4 flex items-center justify-end gap-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-ash-dim" aria-hidden>
            Less
            {SHADE.map((c) => (
              <span key={c} className={`h-2.5 w-2.5 ${c}`} />
            ))}
            More
          </div>
        </>
      ) : (
        <p className="text-lg text-ash">The ledger could not be read just now. See the full history on GitHub.</p>
      )}

      {pushes.length > 0 && (
        <div className="mt-8 border-t border-[var(--rule)] pt-6">
          <p className="label mb-3 text-bone">Recent pushes</p>
          <ol className="divide-y divide-[var(--rule)]">
            {pushes.map((p) => (
              <li key={p.repo}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,14rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
                >
                  <time dateTime={p.pushedAt} className="font-mono text-[0.7rem] uppercase tracking-wider text-ash-dim">
                    {new Date(p.pushedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
                  </time>
                  <span className="truncate font-mono text-sm text-parchment group-hover:underline">{p.repo}</span>
                  <span className="truncate font-serif text-lg text-ash">{p.message ?? "—"}</span>
                  <span className="hidden items-center gap-2 font-mono text-[0.65rem] text-ash-dim sm:flex">
                    {p.language}
                    <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Grid({ days }: { days: ContributionDay[] }) {
  const weeks = toWeeks(days);
  // Month label above the first week that contains the 1st–7th of a month.
  const monthAt = weeks.map((w) => {
    const d = w.find((x) => x && Number(x.date.slice(8, 10)) <= 7);
    return d && w.indexOf(d) === w.findIndex(Boolean) ? MONTHS[Number(d.date.slice(5, 7)) - 1] : "";
  });

  return (
    <figure className="block w-full min-w-[640px]" aria-label="GitHub contribution calendar for the last year">
      <div className="flex gap-[3px] pl-[27px] font-mono text-[0.6rem] text-ash-dim" aria-hidden>
        {weeks.map((_, i) => (
          <span key={i} className="min-w-0 flex-1 overflow-visible whitespace-nowrap">
            {monthAt[i]}
          </span>
        ))}
      </div>
      <div className="mt-1.5 flex gap-[3px]">
        <div className="flex w-6 shrink-0 flex-col gap-[3px] font-mono text-[0.55rem] leading-none text-ash-dim" aria-hidden>
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <span key={i} className="flex flex-1 items-center">
              {d}
            </span>
          ))}
        </div>
        {weeks.map((w, wi) => (
          <div key={wi} className="flex min-w-0 flex-1 flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => {
              const d = w[di];
              return d ? (
                <span key={di} title={label(d)} className={`block aspect-square w-full ${SHADE[d.level] ?? SHADE[0]}`} />
              ) : (
                <span key={di} className="block aspect-square w-full" aria-hidden />
              );
            })}
          </div>
        ))}
      </div>
      <figcaption className="sr-only">
        {days.filter((d) => d.count > 0).length} active days in the last year.
      </figcaption>
    </figure>
  );
}
