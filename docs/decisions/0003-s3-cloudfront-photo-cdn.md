# 0003 — S3 + CloudFront as Photo CDN

**Date:** 2025-05-01
**Status:** Accepted
**Deciders:** Gareth Hughes

## Context

Photo files are large (high-resolution JPEGs). Serving them directly from GitHub Pages would be slow (no image-specific CDN), hit GitHub Pages bandwidth limits, and make the repository impractically large if photos were committed to git. Photos need to be served from a fast, globally distributed CDN with long cache lifetimes.

## Options Considered

### Option A — AWS S3 + CloudFront
- **Summary:** Store photos in an S3 bucket; serve via a CloudFront distribution at `cdn.gareth.photography`
- **Pros:** Industry-standard; CloudFront has 400+ PoPs globally; 1-year immutable cache headers possible; `aws s3 sync` is simple to use; already familiar tooling; S3 default encryption at rest
- **Cons:** AWS account required; small cost for storage + transfer (negligible at portfolio scale); requires manual `make upload-album` step when adding photos

### Option B — Commit photos to git / serve from GitHub Pages
- **Summary:** Store photos in `public/` and let GitHub Pages serve them
- **Pros:** Zero extra infrastructure
- **Cons:** Git is not designed for large binary assets; repo size would grow unboundedly; GitHub Pages bandwidth limits; no CDN PoPs for photo delivery

### Option C — Cloudinary / imgix
- **Summary:** Use a managed image CDN with on-the-fly transforms
- **Pros:** On-the-fly resizing, format conversion (WebP/AVIF), quality adjustment
- **Cons:** Third-party dependency; cost at scale; more complex integration; transforms not needed for this portfolio's current design

## Decision

> We will store photos in AWS S3 and serve them via CloudFront at `cdn.gareth.photography`, with 1-year immutable cache headers.

## Rationale

S3 + CloudFront provides fast global delivery, long cache lifetimes, and low cost at portfolio scale. The `aws` CLI and a simple Makefile are sufficient tooling — no IaC or managed image service is needed. Photos are immutable once uploaded (filenames are sequential integers), so 1-year `Cache-Control: max-age=31536000, immutable` headers are safe and maximally efficient.

## Consequences

- **Positive:** Fast photo loading globally; photos are decoupled from the HTML/CSS deploy; S3 provides durable storage independent of GitHub Pages
- **Negative / trade-offs:** Photos must be uploaded to S3 separately (`make upload-album`) — they are not part of the automated CI deploy; requires AWS credentials in the local environment for uploads
- **Risks:** CloudFront distribution ID must be known to run cache invalidations; if AWS costs become a concern, migration to another CDN is possible since all URLs are centralised through `photoUrl()`

## Related Decisions

- [0006](0006-photourl-single-url-construction-point.md) — `photoUrl()` abstracts the CDN base URL so the CDN can be swapped without changing components
- [0002](0002-github-pages-as-primary-host.md) — photos are offloaded to CloudFront specifically to keep GitHub Pages serving only the lightweight HTML/CSS/JS
