---
name: decision-log
description: Captures and maintains architectural and technical decisions in docs/decisions/ using the ADR format. Keeps the decision index up to date. Triggered whenever a technology is chosen, a pattern is adopted, a trade-off is made, or a proposal is accepted.
compatibility: opencode
---

# Decision Log Skill

You capture, format, and maintain architectural and technical decisions made during
development. You write in the ADR (Architecture Decision Record) format and keep a running
log in `docs/decisions/` so the team has a traceable history of why the system is built the
way it is.

## Project Context

**Project:** gareth.photography — Static photography portfolio site for Gareth Hughes; albums defined in `data/albums.ts`, photos served from CDN in production, deployed to GitHub Pages as a fully static Next.js export.

**Frontend:** Next.js 16.2.4 (App Router, `output: "export"`, fully static) / TypeScript 5 strict / Tailwind CSS v4 (CSS-first, `@theme` in `app/globals.css`)
**Backend:** None — static site only
**Auth:** None — fully public
**Validation:** N/A
**Logging:** None (static site)
**Testing:** None — verify with `npm run build` and `npm run lint`

**Infra:** No IaC; GitHub Pages (primary, CI deploy); S3 + CloudFront for photo CDN; Makefile for manual S3/CDN ops; GitHub Actions CI
**Local dev:** `npm run dev` — photos from `public/photos/<slug>/`

**Compliance:** None (personal portfolio)
**Data classes:** All content is public
**Encryption:** at rest S3 default / in transit HTTPS (CloudFront + GitHub Pages)

**Repo structure:** `app/`, `components/`, `data/`, `lib/`, `scripts/`, `public/photos/`, `.github/workflows/`
**Module structure:** Thin pages in `app/` delegate to components in `components/`. All data is static in `data/albums.ts`. Photo URLs always go through `photoUrl()` in `lib/photos.ts`.

**Key rules:**
- Never construct photo URLs manually — always use `photoUrl(slug, filename)` from `lib/photos.ts`
- Always regenerate dimensions with `node scripts/gen-dimensions.mjs` after adding photos — never hardcode them
- Tailwind v4 CSS-first — no `tailwind.config.*`; all tokens in `app/globals.css`
- `NEXT_PUBLIC_CDN_URL` is the only env var; accessed via `lib/photos.ts` only
- TypeScript strict mode — no `any`, no implicit returns
- Verify changes with `npm run build` + `npm run lint` (no test suite)

**External integrations:** CloudFront CDN (`cdn.gareth.photography`), S3 photo storage, GitHub Pages hosting
**Key entities:** `Album` (public), `Photo` (public) — see `data/types.ts`
**Known gotchas:** Tailwind v4 syntax differs from v3. Next.js 16 has breaking API changes — read `node_modules/next/dist/docs/` before writing code. `params` in dynamic routes is a `Promise<{slug}>` (async params pattern).
**Open onboarding gaps:** 5 items — see `CLAUDE.md` ## Onboarding Notes

---

## When to Log a Decision

Log a decision whenever any of the following occur:
- A technology, library, or framework is chosen or rejected
- An architectural pattern is adopted or explicitly avoided
- A domain-specific calculation approach is finalised
- A trade-off is made between simplicity and flexibility
- An external API limitation forces a workaround
- A configuration approach is chosen (per-entity rules vs global defaults)
- An edge case resolution is agreed
- A security or auth approach is confirmed
- A proposal in `docs/proposals/` is accepted

## ADR File Naming Convention

```
docs/decisions/NNNN-short-kebab-case-title.md
```

Example: `docs/decisions/0001-cache-external-data-in-postgres.md`

Increment NNNN sequentially from the highest existing number. Start at 0001.

## ADR Format

```markdown
# NNNN — Decision Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by [NNNN]
**Deciders:** [list of people or agents involved]
**Proposal:** link to docs/proposals/ file if this decision originated from a proposal

## Context

What is the problem or situation that requires a decision? Include any relevant
constraints — technical, operational, or business. Keep this to 3–5 sentences.

## Options Considered

### Option A — [Name]
- **Summary:** One sentence description
- **Pros:** bullet list
- **Cons:** bullet list

### Option B — [Name]
- **Summary:** One sentence description
- **Pros:** bullet list
- **Cons:** bullet list

*(Add further options as needed)*

## Decision

State the chosen option in one sentence. Example:
> We will cache external API data in Postgres rather than querying live per request.

## Rationale

2–4 sentences explaining why this option was chosen over the alternatives.
Reference specific constraints from the Context section.

## Consequences

- **Positive:** what this decision enables or simplifies
- **Negative / trade-offs:** what this decision costs or constrains
- **Risks:** anything that could cause this decision to be revisited

## Related Decisions

- Links to other ADRs that are affected by or influenced this decision
```

## Your Workflow

When asked to log a decision:
1. List `docs/decisions/` to identify the next available NNNN
2. Create the file at `docs/decisions/NNNN-title.md` using the format above
3. Set Status to `Accepted` unless explicitly told otherwise
4. Add a one-line entry to `docs/decisions/README.md` in the decision index table

## Decision Index Format (docs/decisions/README.md)

```markdown
# Decision Log

| # | Title | Status | Date |
|---|---|---|---|
| [0001](0001-cache-external-data-in-postgres.md) | Cache external data in Postgres | Accepted | YYYY-MM-DD |
```

## When Reviewing Code

Flag any implementation that contradicts an existing ADR. Reference the ADR number in your
comment. Example:

> "This hardcodes the database host as `localhost` — ADR-0002 specifies all external
> connection details must come from `ConfigService`. Please load from config."
