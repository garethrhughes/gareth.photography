# 0004 — Tailwind CSS v4 with CSS-First Configuration

**Date:** 2025-05-01
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

The site needs a styling approach that supports a custom design token system (colour palette, typography, spacing) without requiring a large hand-rolled CSS codebase. Tailwind CSS was chosen as the utility framework; the question was which version and configuration approach to adopt.

## Options Considered

### Option A — Tailwind CSS v4 (CSS-first, `@theme` in globals.css)
- **Summary:** Use Tailwind v4, which moves all configuration into a `@theme` block inside the CSS file; no `tailwind.config.*` file
- **Pros:** Single source of truth for design tokens in CSS; no JavaScript config file to maintain; v4 build is significantly faster; aligns with where the ecosystem is heading
- **Cons:** Breaking changes from v3 — syntax and some utility names differ; documentation is newer and tooling (IDE plugins) may lag slightly; agents trained on v3 may generate incorrect code

### Option B — Tailwind CSS v3 (JS config file)
- **Summary:** Use the stable v3 with `tailwind.config.ts`
- **Pros:** Widely documented; most agent training data covers v3; mature ecosystem
- **Cons:** JS config file is separate from CSS; v3 is now in maintenance mode; migrating later is a larger change

## Decision

> We will use Tailwind CSS v4 with all theme tokens defined in a `@theme inline { … }` block in `app/globals.css`; there is no `tailwind.config.*` file.

## Rationale

Tailwind v4 was chosen to adopt the current direction of the framework and benefit from its faster build performance. The CSS-first approach keeps all design tokens alongside the global styles in `app/globals.css`, avoiding a separate configuration file. The trade-off is that v4 syntax differs from v3 — any agent or developer editing styles must consult v4 documentation rather than relying on v3 knowledge.

## Consequences

- **Positive:** Faster builds; design tokens and global styles colocated; no `tailwind.config.*` to maintain
- **Negative / trade-offs:** v4 syntax differs from v3 — must check docs before editing theme tokens or utility classes; some utility class names changed
- **Risks:** Agents may silently generate v3-style config that appears valid but doesn't work; code review must verify v4 syntax

## Related Decisions

- None
