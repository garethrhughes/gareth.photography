# 0005 — Static TypeScript File as Album Data Source of Truth

**Date:** 2025-05-01
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

The site needs a way to define album metadata (title, year, description, cover image) and photo lists. Options range from a simple static file checked into the repo to a headless CMS or database. The site is a personal portfolio with infrequent content updates made by a single author with direct repo access.

## Options Considered

### Option A — `data/albums.ts` — TypeScript file in the repo
- **Summary:** All album metadata and photo lists are defined as a typed TypeScript array in `data/albums.ts`; edited directly in the repo
- **Pros:** Zero infrastructure; full TypeScript type safety (`Album`, `Photo` interfaces); co-located with the code; version-controlled with git; no external service dependency; works perfectly with `output: "export"` static build
- **Cons:** Adding a new album requires a code change and a deploy; not suitable if a non-technical editor needs to manage content

### Option B — Headless CMS (Contentful, Sanity, etc.)
- **Summary:** Store album and photo data in an external CMS; fetch at build time via API
- **Pros:** Non-technical editing; rich media management; draft/preview workflows
- **Cons:** External dependency and cost; requires API credentials at build time; significantly more complexity for a single-author personal site; overkill

### Option C — JSON / YAML files in the repo
- **Summary:** Store albums as JSON or YAML files, parsed at build time
- **Pros:** Non-TypeScript-aware editors could edit JSON
- **Cons:** No type checking; less ergonomic than TypeScript for a developer; no meaningful advantage over Option A for this use case

## Decision

> We will define all album metadata and photo lists in `data/albums.ts` as a typed TypeScript array; this is the single source of truth for all site content.

## Rationale

For a single-author personal portfolio with infrequent updates made by a developer, a TypeScript file in the repo is the simplest possible approach. It provides full type safety, is version-controlled, requires no external services, and integrates naturally with the static export build. The added complexity of a CMS is not justified.

## Consequences

- **Positive:** No CMS dependency; full type safety; album changes are code-reviewed via git; zero cost
- **Negative / trade-offs:** Every content change requires a code edit and a new deploy; photo dimensions must be regenerated with `node scripts/gen-dimensions.mjs` after adding photos
- **Risks:** If the portfolio grows to require non-developer editing, migrating to a CMS would be a significant change

## Related Decisions

- [0001](0001-nextjs-static-export.md) — static export requires all data to be available at build time, which `data/albums.ts` satisfies
- [0006](0006-photourl-single-url-construction-point.md) — `photoUrl()` reads photo filenames from the data defined here
