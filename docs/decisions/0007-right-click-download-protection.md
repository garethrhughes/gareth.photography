# 0007 — Browser-Level Right-Click and Drag-to-Download Protection on Photo Images

**Date:** 2026-05-03
**Status:** Accepted
**Deciders:** Gareth Hughes, Architect Agent
**Proposal:** [docs/proposals/0001-right-click-download-protection.md](../proposals/0001-right-click-download-protection.md)

## Context

All photo `<img>` elements on the site were unprotected: any visitor could right-click and
"Save Image As", or drag an image to the desktop to download it directly. For a
photographer's portfolio, this bypasses the intentional friction around redistribution.
The change needed to cover three surfaces: `AlbumGrid` (cover images), `PhotoGrid` (grid
thumbnails), and `Lightbox` (full-screen view), without introducing new dependencies or
changing the static site architecture.

## Options Considered

### Option A — `onContextMenu` + `draggable={false}` + CSS on existing elements
- **Summary:** Add browser-level deterrents directly to existing `<img>` elements and their overlay `<div>`s.
- **Pros:** No new dependencies; minimal code change; fully consistent with existing component structure; overlay already present in PhotoGrid and AlbumGrid
- **Cons:** Not a hard technical barrier — motivated users can still use DevTools or view page source

### Option B — Shared `useProtectedImage` hook
- **Summary:** Extract the protection attributes into a reusable hook or HOC.
- **Pros:** DRY across call sites
- **Cons:** Only three call sites; abstraction overhead outweighs benefit; adds indirection

### Option C — Serve only low-resolution thumbnails publicly
- **Summary:** Technical hard barrier: serve low-res images, require auth for full-res.
- **Pros:** Actual download prevention, not just friction
- **Cons:** Major infrastructure and architecture change; contradicts ADR-0001 (fully static, no auth); out of scope

## Decision

> We will apply `onContextMenu` suppression, `draggable={false}`, and `select-none` directly to photo `<img>` elements (and their overlay `<div>`s where present) in the three affected components.

## Rationale

Option A satisfies the stated requirement (reducing casual downloading) with zero new
dependencies and minimal diff surface. Option B is over-engineering for three call sites.
Option C is architecturally inconsistent with ADR-0001 (static export, no auth) and would
require a new proposal and significant infrastructure work. The acknowledged limitation —
that motivated users can still use DevTools — is accepted: the goal is friction reduction,
not absolute prevention.

`AlbumGrid` was converted from a Server Component to a Client Component as a necessary
consequence, since `onContextMenu` is a browser event handler and cannot be serialised
to a Server Component prop. This is appropriate: `AlbumGrid` renders purely presentational
static data passed in as props, so no SSR or static-generation benefit is lost.

## Consequences

- **Positive:** Right-click "Save Image As" and native drag-to-download are suppressed on all photo surfaces with no new runtime dependencies.
- **Negative / trade-offs:** `AlbumGrid` is now a Client Component. This adds a small client JS bundle (negligible for a static portfolio). The protection is friction, not a hard barrier.
- **Risks:** Future Tailwind resets or CSS changes that set `pointer-events: none` on overlays could expose the underlying `<img>` to context menu events — mitigated by the belt-and-suspenders `onContextMenu` placed on both the `<img>` and the overlay.

## Related Decisions

- [ADR-0001](0001-nextjs-static-export.md) — Fully static export; why a server-side or auth-based solution was not chosen
