# Elijah Cortez: Portfolio

A dark medieval / ASCII-gothic portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Motion, Lenis and Lucide.

## Sections

| § | Section | What's interactive |
|---|---------|--------------------|
| — | **Hero** | Real-time ASCII rendering of an armet painting (histogram-equalized, local-contrast tone mapping + Sobel-edge glyphs) with a sweeping steel sheen. The cursor acts as a lantern, the knight scans in on load and dissolves on scroll. **Click the knight** for *The Gauntlet*, a turn-based battle (attack / defend / heal vs. goblin, kobold or mage, then the Ashen Wyrm boss). **Click the marching sentry** for *The Ride*, a horseback endless runner. |
| I | **The Codex** | Bio, life outside code (art, cars, games, training), chronicle, and a *campaign map* of CSUN coursework filterable by "school". |
| II | **The Armory** | RPG-style skill inventory. Inspect items to see where they were used, or equip a loadout of up to 3 to find the projects that used all of them. |
| III | **The Archives** | Four featured projects in a scroll-driven horizontal gallery (vertical on mobile / reduced motion) with slide-out dossiers, a ledger of smaller works, and a live GitHub contribution heat map. |
| IV | **Correspondence** | "Send a letter" composer (opens the visitor's mail app or Gmail, pre-filled), contact links, copy-email, résumé, and a scroll-revealed dithered duel. |

## Editing content

All content lives in `src/data/`, so you don't need to touch the UI:

- `profile.ts`: name, links, degree, honors, work, chronicle and pursuits. Set `availability` to show an availability line.
- `projects.ts`: featured projects (title, stack, links, ASCII emblem, optional `images`), lesser works and future scope.
- `skills.ts`: Armory items, linked to projects and courses by id.
- `courses.ts`: coursework on the campaign map.

Screenshots: put files in `public/images/projects/` and list them in a project's `images` array; the dossier shows them automatically.

The hero's source art is built from `assets/armet-reference.png` with `node scripts/make-armet.mjs`, which cuts out the background, crops the signature and writes `public/images/armet.png`. Swap in another image and rerun it to change the knight.

The GitHub heat map is read from the public contribution calendar for `Gloom-Eiji` (`src/lib/github.ts`). It refreshes about hourly and lists recent pushes (latest commit per recently pushed public repo). Set an optional `GITHUB_TOKEN` env var on Vercel (a token with no scopes) to avoid GitHub's unauthenticated rate limit. Private-repo activity only appears if "Private contributions" is enabled in your GitHub contribution settings. If GitHub is unreachable, the section falls back to a profile link.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (static, heat map revalidates daily)
npm run lint
```

## Deploy (Vercel)

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project**, import the repo, and keep the detected Next.js defaults.
3. Optional: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.vercel.app`) so Open Graph image URLs are absolute.

Every push to a branch gets a preview deployment, and pushes to `main` go to production.

## Accessibility & motion

- `prefers-reduced-motion` disables smooth scrolling, the horizontal pin, scroll reveals, text scrambles and the knight's animation (it renders a still frame).
- Content is server-rendered and readable without JavaScript. The preloader removes itself with CSS and can be skipped with any key or click.
- Skip link, visible focus states, keyboard-operable controls, and a focus-managed dialog (Esc closes it).

## Legacy

The previous static site is preserved in `legacy/` for reference. It is not part of the build.
