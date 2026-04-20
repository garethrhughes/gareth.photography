<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# gareth.photography

A static photography portfolio site built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build (outputs to out/)
npm run lint     # ESLint
make upload-album ALBUM=<slug>   # sync one album's photos to S3
make upload                      # sync all albums to S3
make deploy                      # build + sync site to S3
make invalidate CLOUDFRONT_ID=<id>  # purge CloudFront cache
```

After adding new photos to an album, regenerate dimensions:
```bash
node scripts/gen-dimensions.mjs
```

## Project Structure

- `app/` — Next.js App Router pages
  - `page.tsx` — home page (album grid)
  - `[slug]/page.tsx` — individual album page
- `components/` — shared UI components (AlbumGrid, PhotoGrid, Lightbox, Header, Footer, etc.)
- `data/albums.ts` — single source of truth for all album metadata and photo lists
- `data/types.ts` — TypeScript interfaces (`Album`, `Photo`)
- `lib/photos.ts` — `photoUrl()` helper (resolves CDN vs local path)
- `public/photos/<slug>/` — local photo files (dev only; production uses CDN)
- `scripts/` — utility scripts (import, dimension generation)

## Data Model

Albums are defined in `data/albums.ts` and exported as `albums: Album[]`.

```ts
interface Album {
  slug: string;
  title: string;
  year: number;
  coverImage: string;
  description?: string;  // optional, rendered on album page if present
  photos: Photo[];
}
```

Photo filenames are sequential: `001.jpg`, `002.jpg`, etc.

Dimensions in `data/albums.ts` are used by `PhotoGrid` for justified row layout. Always regenerate with `node scripts/gen-dimensions.mjs` after adding photos — do not guess or hardcode new dimensions manually.

## Photo URLs

- Dev: photos served from `/photos/<slug>/` (local `public/photos/`)
- Production: `NEXT_PUBLIC_CDN_URL=https://cdn.gareth.photography` must be set at build time

Use `photoUrl(slug, filename)` from `lib/photos.ts` — never construct photo URLs manually.

## Conventions

- No test suite — verify changes with `npm run build` and `npm run lint`
- Tailwind CSS v4 is used — syntax and config may differ from v3; check docs if uncertain
- The `poopoo` album is a real album (test/personal shots); treat it like any other
- `CLAUDE.md` is an alias for this file (`@AGENTS.md`) — do not edit it separately
