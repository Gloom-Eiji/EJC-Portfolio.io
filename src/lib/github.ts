import { cacheLife } from "next/cache";

export type ContributionDay = { date: string; level: number; count: number };
export type Contributions = { days: ContributionDay[]; total: number };

/**
 * Reads the public contribution calendar GitHub shows on a profile page.
 * Cached for about an hour, so recent activity shows up quickly without
 * hitting GitHub on every request.
 * Returns null on any failure so the page still renders.
 */
export async function getContributions(user: string): Promise<Contributions | null> {
  "use cache";
  cacheLife("hours");

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

export type RecentPush = {
  repo: string;
  url: string;
  pushedAt: string;
  message?: string;
  language?: string | null;
};

// Optional: set GITHUB_TOKEN (no scopes needed) to avoid the unauthenticated
// 60-requests-per-hour API limit on shared build machines.
function apiHeaders(): HeadersInit {
  const h: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-recent-pushes" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

/**
 * The most recently pushed public repositories, each with its latest commit
 * message. GitHub's public events feed can be empty, so this reads repos
 * (sorted by push time) and their newest commit instead.
 */
export async function getRecentPushes(user: string, limit = 5): Promise<RecentPush[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=${limit + 3}`,
      { headers: apiHeaders() },
    );
    if (!res.ok) return [];
    const repos = (await res.json()) as {
      name: string;
      full_name: string;
      html_url: string;
      pushed_at: string;
      language: string | null;
      size: number;
    }[];

    const picked = repos.filter((r) => r.size > 0).slice(0, limit);
    return await Promise.all(
      picked.map(async (r) => {
        let message: string | undefined;
        try {
          const c = await fetch(`https://api.github.com/repos/${r.full_name}/commits?per_page=1`, { headers: apiHeaders() });
          if (c.ok) {
            const [latest] = (await c.json()) as { commit: { message: string } }[];
            message = latest?.commit.message.split("\n")[0];
          }
        } catch {
          // keep the repo without a message
        }
        return { repo: r.name, url: r.html_url, pushedAt: r.pushed_at, message, language: r.language };
      }),
    );
  } catch {
    return [];
  }
}
