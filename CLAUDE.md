# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev         # start Vite dev server (http://localhost:3000, opens browser automatically)
npm run build        # production build -> dist/
npm run preview       # serve the dist/ build locally
npm run lint         # runs `eslint .` — NOTE: no ESLint config or eslint package exists in
                # this repo yet, so this currently fails; treat as aspirational
                # until an eslint config + dependency are added
```

There is no test suite/runner configured in this project.

Dev server port is fixed at `3000` (set in `vite.config.js`), not Vite's default `5173`.

## Architecture

This is a **single-page portfolio** (Vite + React 18 + Tailwind CSS), not a multi-route app. All
"pages" (`#about`, `#projects`, `#education`, `#skills`, `#contact`) are anchor-scrolled sections
within one `index.html` — there is no router.

### Content is data-driven from a single file

`src/data/portfolioData.js` is the single source of truth for all personal content: bio, socials,
stats, `projectsData`, `educationData`, `skillsMatrix`, and the `terminalCommands` map used by the
CLI easter egg. Components (`Hero`, `Projects`, `Education`, `Skills`, `Navbar`, `CommandPalette`,
`TerminalDrawer`) import from here rather than hardcoding content. When asked to update project
info, skills, bio text, or social links, edit this file — not the JSX.

### Composition & code-splitting (`src/App.jsx`)

- `Navbar` and `Hero` render eagerly (above the fold).
- `Projects`, `Education`, `Skills`, `Contact` are `React.lazy`-loaded together inside one
  `<Suspense>` boundary — this is *code-splitting for bundle size*, not scroll-triggered lazy
  mounting; they still load immediately on initial render, just as separate chunks.
- `CommandPalette` and `TerminalDrawer` are floating overlays that are lazy-loaded **and**
  conditionally rendered (`{isOpen && <...>}`) — they don't mount at all until opened.
- A global `keydown` listener in `App.jsx` toggles the command palette on ⌘K/Ctrl+K. `Navbar` and
  `Hero` also expose buttons that call the same open/toggle handlers passed down as props.

### Shared UI primitives

- `src/components/Reveal.jsx` — generic scroll-reveal wrapper using `IntersectionObserver` (no
  animation library). Applies `.reveal` / `.is-visible` classes defined in `src/index.css`
  (opacity + transform transition). Used throughout `Projects`, `Education`, `Skills`, `Contact`
  instead of any per-component animation logic. `prefers-reduced-motion` is handled globally via a
  CSS media query in `index.css` that zeroes out transition/animation durations — individual
  components don't need to check this themselves except `BackgroundCanvas` (see below).
- `src/components/SectionHeader.jsx` — the badge + heading + description pattern repeated at the
  top of `Projects`, `Education`, `Skills`, `Contact`. Takes an `icon`, `badge`, `title`,
  `description`, and `accent` (`'cyan' | 'purple'`). Add new sections using this rather than
  duplicating the header markup.
- `src/hooks/useReducedMotion.js` exists as a reusable hook but is currently **unused** —
  `BackgroundCanvas.jsx` does its own inline `matchMedia('(prefers-reduced-motion: reduce)')` check
  instead. Prefer wiring new motion-sensitive components to the hook rather than re-inlining the
  check, and consider migrating `BackgroundCanvas` to it if touching that file.

### `BackgroundCanvas.jsx`

Hand-rolled `<canvas>` particle animation (no library) with several perf/a11y guards worth knowing
about before modifying it: DPR is capped at 2, particle count/link distance scale down under a
`max-width: 768px` media query, the render loop is cancelled via the `visibilitychange` event when
the tab is hidden, and a single static frame is drawn (no `requestAnimationFrame` loop at all) when
`prefers-reduced-motion` is set. Any changes to particle count/behavior should preserve these guards
rather than just tuning the numbers.

### Contact form (`src/components/Contact.jsx`)

Submits to **Web3Forms** (`https://api.web3forms.com/submit`) — a serverless form backend, since
this is a static Vite site with no backend of its own. The access key resolves as:
`import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '<hardcoded fallback key>'`. Web3Forms access keys are
safe to expose client-side (they only authorize submissions to the one registered recipient email,
configured in the Web3Forms dashboard, not in this repo). If the key is unset/placeholder, the form
falls back to opening a `mailto:` link instead of calling the API. There's a hidden honeypot
checkbox (`name="botcheck"`) for basic spam filtering — if it's non-empty on submit, `handleSubmit`
returns silently. Web3Forms free tier caps at 250 submissions/month and has its own spam
classification separate from Gmail's — a "success" API response does not guarantee the notification
email lands in the inbox (see the form's own dashboard "Spam" tab as a fallback way to check for
messages that came through but weren't emailed).

### Static SEO assets served from `public/`

`robots.txt`, `sitemap.xml`, `favicon.svg`, `site.webmanifest`, and `profile.jpg` live in `public/`
and are copied verbatim to the build output root by Vite. `vercel.json` has a catch-all rewrite
(`/(.*) -> /index.html` for SPA routing), but Vercel's static-file-first routing serves these files
directly before the rewrite applies — confirmed by fetching the deployed URLs directly, they return
the raw file with the correct `Content-Type`, not `index.html`. Since this is a single-page site
with no real sub-routes, `sitemap.xml` intentionally contains only the homepage URL — don't add
entries for `#anchor` sections, they aren't distinct crawlable pages.

Meta tags, Open Graph/Twitter cards, and the Person/WebSite/ProfilePage JSON-LD structured data all
live directly in `index.html` (this is a Vite SPA, not Next.js — there's no metadata API or
file-based sitemap generation). The canonical production URL used throughout
(`https://qadees-asghar.vercel.app`) is hardcoded in `index.html`, `public/robots.txt`, and
`public/sitemap.xml` — if the production domain ever changes, all three need updating together.

### Tailwind theme

Custom design tokens live in `tailwind.config.js` under `theme.extend`: the `cyber` color palette
(`cyber-dark`, `cyber-card`, `cyber-accent`, etc.), custom fonts (`Inter` for sans, `Fira Code` for
mono), and custom keyframes (`glow`, `float`, `fadeIn`, `fade-up`). Reusable non-Tailwind CSS classes
(`.glass-panel`, `.gradient-text`, `.reveal`, `.skip-link`, `.noise-overlay`) are defined in
`src/index.css` rather than as Tailwind utilities, since they combine multiple properties
(backdrop-filter, gradient masks, etc.) that don't map cleanly to single utility classes.

## Deployment

Deployed on Vercel from the `main` branch (repo: `github.com/Qadees-Asghar/portfolio`), auto-deploys
on push. `vercel.json` sets `framework: vite`, `buildCommand: npm run build`,
`outputDirectory: dist`. Node.js is required locally to run `npm install`/`build`/`dev` (v24+ has
been used during development).
