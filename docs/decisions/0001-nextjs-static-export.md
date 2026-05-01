# 0001 — Use Next.js Static Export (No SSR)

**Date:** 2025-05-01
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

This is a personal photography portfolio — all content is known at build time (albums and photos defined in `data/albums.ts`), there are no user accounts, no form submissions, no personalisation, and no backend. The site needs to be fast to load globally and cheap (ideally free) to host. No runtime server is available on GitHub Pages.

## Options Considered

### Option A — Next.js `output: "export"` (fully static)
- **Summary:** Build to a flat `out/` directory of HTML/CSS/JS; no Node server needed at runtime
- **Pros:** Free hosting on GitHub Pages; zero runtime cost; maximum CDN cachability; no server to maintain or secure; fast TTFB anywhere in the world
- **Cons:** No server-side rendering on demand; no API routes; Next.js image optimisation disabled (`unoptimized: true`); all data must be static at build time

### Option B — Next.js deployed to a Node host (SSR/ISR)
- **Summary:** Run Next.js on a Node server or edge runtime (e.g. Vercel, Fly.io)
- **Pros:** Enables API routes, ISR, dynamic routes not known at build time, image optimisation
- **Cons:** Hosting cost; operational overhead; none of the dynamic capabilities are needed for a portfolio

### Option C — Simpler SSG (Astro, Hugo, Eleventy)
- **Summary:** Use a purpose-built static site generator
- **Pros:** Smaller bundle, simpler mental model, faster builds
- **Cons:** Requires learning a new framework; Next.js App Router is already familiar; React component model preferred for the interactive lightbox

## Decision

> We will use Next.js with `output: "export"` to produce a fully static site with no runtime server.

## Rationale

The portfolio has no dynamic content requirements — all albums and photos are defined at build time. Static export eliminates hosting cost and operational complexity, enables free GitHub Pages deployment, and delivers maximum performance via CDN. The Next.js App Router was chosen over a simpler SSG to retain the React component model (needed for the interactive `Lightbox` component) and familiarity.

## Consequences

- **Positive:** Free hosting; zero runtime infrastructure; full CDN cachability; simple deployment pipeline
- **Negative / trade-offs:** `next/image` optimisation is disabled (`unoptimized: true`); no API routes; adding any server-side feature in future requires migrating to a hosting platform that runs Node
- **Risks:** If the portfolio ever needs dynamic features (search, user uploads, comments), the static export constraint will need to be revisited

## Related Decisions

- [0002](0002-github-pages-as-primary-host.md) — static export enables free GitHub Pages hosting
- [0005](0005-static-data-in-albums-ts.md) — static export requires all data to be available at build time
