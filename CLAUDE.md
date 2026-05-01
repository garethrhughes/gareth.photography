<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CLAUDE.md — gareth.photography

## Project Overview

A static photography portfolio site for Gareth Hughes. Albums and photos are defined in `data/albums.ts`, served from a CDN in production and from `public/photos/` in development, and deployed to GitHub Pages as a fully static Next.js export. Photos are also mirrored to S3 + CloudFront (`cdn.gareth.photography`) which acts as the photo CDN.

---

## Tech Stack

### Frontend
| Concern | Choice |
|---|---|
| Framework | Next.js 16.2.4 (App Router, `output: "export"` — fully static) |
| Language | TypeScript 5, `strict: true` |
| Styling | Tailwind CSS v4 (CSS-first; `@theme` block in `app/globals.css`) |
| Icons | lucide-react |
| Fonts | Geist Sans + Geist Mono via `next/font/google` |
| State | None — fully static, no client state library |
| Testing | None — verify with `npm run build` and `npm run lint` |
| HTTP | None — all data is static (`data/albums.ts`); no client-side fetching |
| Data fetching | Static data at build time only |

### Infrastructure
| Concern | Choice |
|---|---|
| Hosting | GitHub Pages (CI deploy on push to `main`) |
| CDN | CloudFront (`cdn.gareth.photography`) — photo assets only |
| Photo storage | S3 bucket (`gareth.photography`) |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) — push to `main` or manual dispatch |
| IaC | None — Makefile + `aws` CLI |
| Local dev | `npm run dev` — photos served from `public/photos/<slug>/` |
| Task automation | Makefile |
| Config | `NEXT_PUBLIC_CDN_URL` — single env var injected at build time in CI |
| Observability | None (static portfolio, no server) |

### Security & Compliance
| Concern | Choice |
|---|---|
| Compliance frameworks | None (personal portfolio) |
| Encryption at rest | S3 default encryption (AWS default) |
| Encryption in transit | HTTPS via CloudFront + GitHub Pages |
| Data classification | N/A — all content is fully public |
| Vulnerability scanning | None configured |
| Auth | None — fully public static site |

---

## Repository Structure

```
gareth.photography/
├── app/
│   ├── [slug]/page.tsx      # individual album page
│   ├── globals.css          # Tailwind v4 @theme config + light-mode tokens
│   ├── layout.tsx           # root layout — Header, Footer, Geist fonts, metadata
│   └── page.tsx             # home page — renders AlbumGrid
├── components/
│   ├── AlbumGrid.tsx        # home page grid of album covers
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Lightbox.tsx         # full-screen photo viewer
│   ├── MobileMenu.tsx
│   └── PhotoGrid.tsx        # justified-row photo grid for album pages
├── data/
│   ├── albums.ts            # single source of truth: album metadata + photo lists
│   └── types.ts             # Album, Photo interfaces
├── lib/
│   └── photos.ts            # photoUrl() helper — CDN vs local path
├── scripts/
│   ├── gen-dimensions.mjs   # regenerates photo dimensions for justified layout
│   └── import-photos.mjs    # import photos from a source directory
├── public/photos/<slug>/    # local photo files (dev only)
├── .github/workflows/
│   └── deploy.yml           # build + deploy to GitHub Pages
├── Makefile                 # local task automation (build, deploy, S3 upload)
├── AGENTS.md                # (= CLAUDE.md) authoritative project docs for agents
└── next.config.ts           # static export, trailingSlash, unoptimized images
```

---

## Architecture Rules

### Frontend
- Pages are thin — they import data and delegate rendering to components in `components/`
- All photo URLs must go through `photoUrl(slug, filename)` from `lib/photos.ts` — never construct photo paths manually
- `NEXT_PUBLIC_CDN_URL` is the only env var; access it through `lib/photos.ts`, not directly via `process.env` outside that module
- Dimensions in `data/albums.ts` are used for justified row layout — always regenerate with `node scripts/gen-dimensions.mjs` after adding photos; never hardcode or guess dimensions manually
- Photo filenames are sequential: `001.jpg`, `002.jpg`, etc.
- `dynamicParams = false` on `[slug]/page.tsx` — only statically known slugs are valid
- The `poopoo` album is a real album (personal shots); treat it like any other

### TypeScript
- `strict: true` in `tsconfig.json` — no `any`, no implicit returns
- Path alias `@/*` resolves to the repo root
- `moduleResolution: bundler`

### Tailwind CSS v4
- No `tailwind.config.*` file — Tailwind v4 is CSS-first; all theme tokens live in `app/globals.css` under `@theme inline { … }`
- V4 syntax differs from V3 — check docs before editing theme tokens or utility classes

---

## Security Rules (hard blocks)

- No credentials, tokens, or secrets committed in any file (including `.env` files)
- `NEXT_PUBLIC_CDN_URL` accessed only via `lib/photos.ts` — not via raw `process.env` elsewhere in app code
- No hardcoded external service URLs or resource IDs in source code — use `photoUrl()` and env config
- No `dangerouslySetInnerHTML` for user-supplied content
- Lockfile changes must correspond to an intentional dependency change

---

## External Integrations

| Name | Purpose | Auth |
|---|---|---|
| CloudFront (`cdn.gareth.photography`) | Photo CDN — serves images at production | AWS credentials (Makefile only); no auth in app code |
| S3 (`gareth.photography` bucket) | Photo storage and static site backup | AWS CLI via Makefile; credentials from environment |
| GitHub Pages | Static site hosting | GitHub Actions OIDC (`id-token: write`) |

---

## Domain Model

| Entity | Data Class | Notes |
|---|---|---|
| `Album` | Public | slug, title, year, cover image, optional description, photo list |
| `Photo` | Public | src, alt, optional width/height for justified layout |

---

## Testing Requirements

- No test suite — verify all changes with `npm run build` and `npm run lint`
- After adding photos to any album, run `node scripts/gen-dimensions.mjs` before building

---

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build (outputs to out/)
npm run lint     # ESLint

make upload-album ALBUM=<slug>   # sync one album's photos to S3
make upload                      # sync all albums to S3
make deploy                      # build + sync site to S3
make invalidate CLOUDFRONT_ID=<id>  # purge CloudFront cache

node scripts/gen-dimensions.mjs  # regenerate photo dimensions after adding photos
```

---

## Design & Proposal Workflow

Write a proposal in `docs/proposals/NNNN-short-kebab-case-title.md` before implementing any:
- New component or significant UI pattern
- New data structure or change to `data/types.ts`
- New external integration or CDN/hosting change
- Cross-cutting concern (e.g. dark mode, internationalisation, search)
- Change to the deployment pipeline

When a proposal is accepted, create the corresponding ADR in `docs/decisions/NNNN-title.md`
and update the proposal status to `Accepted`.

See the `architect` and `decision-log` skills for the exact proposal and ADR formats.

---

## Settled Decisions (do not revisit without a superseding ADR)

| # | Decision |
|---|---|
| [0001](docs/decisions/0001-nextjs-static-export.md) | Use Next.js `output: "export"` — fully static, no SSR or API routes |
| [0002](docs/decisions/0002-github-pages-as-primary-host.md) | GitHub Pages is the primary hosting target; deployed via GitHub Actions on push to `main` |
| [0003](docs/decisions/0003-s3-cloudfront-photo-cdn.md) | Photos stored in S3 and served via CloudFront at `cdn.gareth.photography` |
| [0004](docs/decisions/0004-tailwind-v4-css-first.md) | Tailwind CSS v4, CSS-first — all theme tokens in `app/globals.css`; no `tailwind.config.*` |
| [0005](docs/decisions/0005-static-data-in-albums-ts.md) | `data/albums.ts` is the single source of truth for all album and photo data; no CMS |
| [0006](docs/decisions/0006-photourl-single-url-construction-point.md) | All photo URLs constructed via `photoUrl()` in `lib/photos.ts`; no direct `process.env` access in components |

---

## Onboarding Notes

*Gaps observed between the current code and the standard rules these skills assume.
Each item is a candidate for a proposal via the `architect` skill or a backlog ticket.
Delete this section once gaps are addressed or explicitly accepted.*

- `README.md` is still the boilerplate `create-next-app` README — replace with a proper project README (requested)
- `docs/proposals/` and `docs/decisions/` directories do not exist — scaffold them when the first proposal is written
- No vulnerability scanning configured — no Dependabot, no `npm audit` step in CI
- No `renovate.json` or Dependabot config for automated dependency updates
- No explicit S3 bucket policy or CloudFront security headers documented in the repo — encryption-at-rest posture relies on AWS defaults
