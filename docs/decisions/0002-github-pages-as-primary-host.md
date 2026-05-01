# 0002 — GitHub Pages as Primary Hosting Target

**Date:** 2025-05-01
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

The site is a fully static export (see ADR-0001). It needs to be publicly accessible at `gareth.photography`. Hosting must be low-cost (ideally free) and require minimal operational maintenance. A custom domain with HTTPS is required.

## Options Considered

### Option A — GitHub Pages
- **Summary:** Deploy the `out/` static build directly to GitHub Pages via GitHub Actions
- **Pros:** Free; natively integrated with the existing GitHub repo; OIDC-based deploy (no long-lived tokens); supports custom domain + automatic HTTPS via Let's Encrypt; deploy-on-push with no extra tooling
- **Cons:** No server-side features (not needed); build time counts against GitHub Actions minutes (negligible for this project)

### Option B — Netlify / Vercel
- **Summary:** Deploy to a managed static hosting platform
- **Pros:** Better DX features (deploy previews, branch deploys); built-in analytics
- **Cons:** Adds a third-party dependency; free tier limits may apply; GitHub Pages is simpler for a straightforward static site

### Option C — S3 Static Website Hosting
- **Summary:** Serve the static build directly from the S3 bucket
- **Pros:** Already using S3 for photo storage; consolidated infrastructure
- **Cons:** Requires CloudFront in front for HTTPS + custom domain; more operational setup; GitHub Pages is effectively free CDN-backed hosting with zero config

## Decision

> We will use GitHub Pages as the primary hosting target, deployed automatically via GitHub Actions on push to `main`.

## Rationale

GitHub Pages provides free, CDN-backed static hosting with HTTPS and custom domain support, and integrates directly with the repository via Actions OIDC — no long-lived credentials needed. The site is fully static, so none of the advanced hosting features of Netlify/Vercel are needed. The Makefile retains `make deploy` as a fallback to S3, but GitHub Actions is the canonical deployment path.

## Consequences

- **Positive:** Zero hosting cost; deploy is fully automated on push to `main`; HTTPS provisioned automatically; no third-party account required beyond GitHub
- **Negative / trade-offs:** No deploy previews for PRs; GitHub Pages has a 1 GB soft limit and bandwidth caps (not a concern for this portfolio)
- **Risks:** GitHub Pages availability is dependent on GitHub; if a runtime server is ever needed, migration to a different host is required

## Related Decisions

- [0001](0001-nextjs-static-export.md) — static export is a prerequisite for GitHub Pages hosting
- [0003](0003-s3-cloudfront-photo-cdn.md) — photos are not served from GitHub Pages; they are offloaded to CloudFront
