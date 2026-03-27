# Monochrome GSAP Portfolio (Next.js + Tailwind)

Modern developer portfolio built with Next.js (App Router), Tailwind CSS, and GSAP-level interactions. Designed to be hosted via static export.

## Quick Start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Static Export

Static export is configured via `output: "export"` in `next.config.ts`.

```bash
npm run export
```

The output will be written to `./out/` (generated during `next build`).

## Content Customization

All portfolio copy comes from:

- `src/components/content/portfolio-content.ts`

Update:
- `name`, `role`, `tagline`, `about[]`, `skills[]`
- `projects[]` (used by the `/projects` gallery + previews)
- `contact.email` and `contact.location`

## Animation System (Where to edit)

GSAP helpers and primitives:
- `src/lib/gsap.ts` (client-safe plugin registration)
- `src/components/gsap/RevealText.tsx` (word-by-word + line grouping reveals)
- `src/components/gsap/ScrollReveal.tsx` (scroll-triggered section reveals)

Premium interactions:
- `src/components/layout/RouteTransition.tsx` (cinematic route overlay transition)
- `src/components/cursor/Cursor.tsx` (custom pointer overlay)
- `src/components/noise/NoiseOverlay.tsx` (subtle animated grain overlay)
- `src/components/projects/*` (project gallery cards + GSAP modal)

## Accessibility / Performance Notes

- Reduced-motion is detected and animations are simplified/disabled accordingly.
- Animations are implemented in client components and scoped with `gsap.context()` for safer cleanup.
