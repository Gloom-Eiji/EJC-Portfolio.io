import { cacheLife } from "next/cache";

export type ContributionDay = { date: string; level: number; count: number };
export type Contributions = { days: ContributionDay[]; total: number };

/**
 * Reads the public contribution calendar GitHub shows on a profile page.
 * Cached for about a day, so GitHub is hit at most once per revalidation.
 * Returns null on any failure so the page still renders.
 */
export async function getContributions(user: string): Promise<Contributions | null> {
  "use cache";
  cacheLife("days");

  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(user)}/contributions`, {
      headers: { "User-Agent": "portfolio-contribution-calendar", Accept: "text/html" },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Counts live in tooltips keyed by the cell's id.
    const counts = new Map<string, number>();
    for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>\s*(No|\d+) contributions?/g)) {
      counts.set(m[1], m[2] === "No" ? 0 : Number(m[2]));
    }

    const days: ContributionDay[] = [];
    for (const m of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
      const tag = m[0];
      const date = /data-date="(\d{4}-\d{2}-\d{2})"/.exec(tag)?.[1];
      const level = /data-level="(\d)"/.exec(tag)?.[1];
      const id = /\bid="([^"]+)"/.exec(tag)?.[1];
      if (!date || level === undefined) continue;
      days.push({ date, level: Number(level), count: (id && counts.get(id)) || 0 });
    }
    if (days.length < 7) return null;

    days.sort((a, b) => a.date.localeCompare(b.date));
    return { days, total: days.reduce((s, d) => s + d.count, 0) };
  } catch {
    return null;
  }
}
