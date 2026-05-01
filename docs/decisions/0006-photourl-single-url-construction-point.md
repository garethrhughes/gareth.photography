# 0006 — `photoUrl()` as the Single Photo URL Construction Point

**Date:** 2025-05-01
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

Photos are served from different base URLs depending on environment: `/photos/<slug>/` in local development, and `https://cdn.gareth.photography/<slug>/` in production. Components and pages need to reference photo URLs without hardcoding environment-specific paths. The URL base must be easy to change if the CDN provider ever changes.

## Options Considered

### Option A — `photoUrl(slug, filename)` helper in `lib/photos.ts`
- **Summary:** A single exported function reads `NEXT_PUBLIC_CDN_URL` (or falls back to `/photos`) and constructs the full URL; all components call this function
- **Pros:** CDN base URL change requires editing one file; environment switching (dev vs prod) is automatic; no `process.env` access scattered across components; easy to test or stub
- **Cons:** Minor indirection — callers must import from `lib/photos.ts`

### Option B — Direct `process.env.NEXT_PUBLIC_CDN_URL` access in each component
- **Summary:** Each component builds the URL inline
- **Pros:** No abstraction needed
- **Cons:** CDN URL change requires editing every component; `process.env` scattered throughout the codebase; easy to make mistakes or inconsistencies

## Decision

> All photo URL construction must go through `photoUrl(slug, filename)` from `lib/photos.ts`; direct `process.env` access for photo paths is prohibited outside that module.

## Rationale

Centralising URL construction in a single helper means the CDN base URL is defined and tested in one place. If the CDN ever changes (e.g. migrating from CloudFront to another provider), only `lib/photos.ts` needs to change. It also keeps `NEXT_PUBLIC_CDN_URL` — the only runtime env var in the app — encapsulated rather than spread across component code.

## Consequences

- **Positive:** CDN migration is a one-file change; no `process.env` access in components; clear, enforceable convention
- **Negative / trade-offs:** Components must import from `lib/photos.ts`; a minor additional import
- **Risks:** None significant

## Related Decisions

- [0003](0003-s3-cloudfront-photo-cdn.md) — `photoUrl()` abstracts the CloudFront base URL defined by `NEXT_PUBLIC_CDN_URL`
- [0005](0005-static-data-in-albums-ts.md) — photo filenames come from `data/albums.ts`; `photoUrl()` combines slug + filename into the full URL
