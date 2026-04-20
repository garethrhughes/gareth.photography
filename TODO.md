# Production TODO

## Infrastructure
- [x] Set `CLOUDFRONT_ID` as a GitHub Actions secret (`Settings → Secrets → Actions`)
- [x] Add `NEXT_PUBLIC_CDN_URL=https://cdn.gareth.photography` to the GitHub Actions workflow (`deploy.yml`) so production builds resolve photos from the CDN instead of the local `/photos/` path

## Photos
- [x] Run `node scripts/import-photos.mjs` for any albums not yet downloaded locally
- [x] Run `make upload` to sync all local photo albums to S3 (`photos.gareth.photography`)
- [x] Confirm photos are accessible at `https://cdn.gareth.photography/<slug>/<file>.jpg`

## Code
- [x] Fix the comment in `data/albums.ts` — refers to `gen-dimensions.py` but the script is `scripts/gen-dimensions.mjs`
- [x] Add `NEXT_PUBLIC_CDN_URL` to a `.env.example` file so it's documented for future reference

## Deployment
- [x] Update `.github/workflows/deploy.yml` to inject `NEXT_PUBLIC_CDN_URL` at build time
- [ ] Push to `main` and confirm GitHub Actions build passes
- [ ] Verify the live site at https://gareth.photography resolves photos from the CDN
- [ ] Run `make invalidate CLOUDFRONT_ID=<id>` if any existing CDN-cached content needs purging
