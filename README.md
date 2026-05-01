# gareth.photography

A static photography portfolio site built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Local Development

```bash
npm install
npm run dev
```

Photos are served from `public/photos/<slug>/` in development. Production photos are served from `https://cdn.gareth.photography`.

## Adding Photos

1. Copy photos into `public/photos/<slug>/` named sequentially: `001.jpg`, `002.jpg`, etc.
2. Add or update the album entry in `data/albums.ts`
3. Regenerate dimensions for the justified layout:
   ```bash
   node scripts/gen-dimensions.mjs
   ```
4. Verify with `npm run build`

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build (outputs to out/)
npm run lint     # ESLint

make upload-album ALBUM=<slug>   # sync one album's photos to S3/CDN
make upload                      # sync all albums to S3/CDN
make deploy                      # build + sync site to S3
make invalidate CLOUDFRONT_ID=<id>  # purge CloudFront cache
```

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages via GitHub Actions.

Photo assets are stored on S3 (`gareth.photography` bucket) and served via CloudFront (`cdn.gareth.photography`). Use `make upload-album` or `make upload` to sync photos after adding them.

## Tech Stack

- **Framework:** Next.js 16 — App Router, fully static export (`output: "export"`)
- **Language:** TypeScript 5 (strict)
- **Styling:** Tailwind CSS v4 (CSS-first; theme tokens in `app/globals.css`)
- **Hosting:** GitHub Pages
- **Photo CDN:** CloudFront

## Project Structure

```
app/                    # Next.js App Router pages
  page.tsx              # home page (album grid)
  [slug]/page.tsx       # individual album page
components/             # shared UI components
data/
  albums.ts             # single source of truth: all album metadata and photo lists
  types.ts              # TypeScript interfaces (Album, Photo)
lib/
  photos.ts             # photoUrl() helper — resolves CDN vs local path
public/photos/<slug>/   # local photo files (dev only)
scripts/
  gen-dimensions.mjs    # regenerates photo dimensions
  import-photos.mjs     # import photos from a source directory
```
