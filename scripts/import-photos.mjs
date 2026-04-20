#!/usr/bin/env node
/**
 * scripts/import-photos.mjs
 *
 * Downloads all photos from the live Adobe Portfolio site at gareth.photography
 * and saves them to public/photos/<album-slug>/ with sequential filenames.
 *
 * Usage:
 *   node scripts/import-photos.mjs              # download all albums
 *   node scripts/import-photos.mjs noosa        # download one album
 *
 * Requirements: Node 18+ (uses built-in fetch)
 */

import { createWriteStream, mkdirSync, existsSync } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/photos");

// Album slug → Adobe Portfolio page URL
const ALBUMS = {
  noosa: "https://gareth.photography/noosa/",
  nurragingy: "https://gareth.photography/nurragingy/",
  manly: "https://gareth.photography/manly/",
  "secret-creek": "https://gareth.photography/secret-creek/",
  "sydney-night": "https://gareth.photography/sydney-night/",
  "blue-mountains-botanic-garden": "https://gareth.photography/blue-mountains-botanic-garden/",
  "taralga-wildlife-park": "https://gareth.photography/taralga-wildlife-park/",
  "longneck-lagoon": "https://gareth.photography/longneck-lagoon/",
  "new-camera": "https://gareth.photography/new-camera/",
  "blue-mountains": "https://gareth.photography/blue-mountains/",
  "rouse-hill": "https://gareth.photography/rouse-hill/",
  poopoo: "https://gareth.photography/poopoo/",
  legacy: "https://gareth.photography/legacy/",
};

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; photo-importer/1.0)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

function extractImageUrls(html) {
  // Full-res images: data-src="...uuid_rw_1920.jpg?h=..."
  const photoRe = /data-src="(https:\/\/cdn\.myportfolio\.com\/[^"]+_rw_1920\.jpg\?h=[^"]+)"/g;
  const coverRe = /data-src="(https:\/\/cdn\.myportfolio\.com\/[^"]+_car_4x3(?:xw?[\d]+)?\.jpg\?h=[^"]+)"/g;

  const photos = [];
  let m;
  while ((m = photoRe.exec(html)) !== null) {
    if (!photos.includes(m[1])) photos.push(m[1]);
  }

  let cover = null;
  while ((m = coverRe.exec(html)) !== null) {
    cover = m[1];
    break; // first one is the album cover
  }

  return { photos, cover };
}

async function downloadFile(url, dest) {
  if (existsSync(dest)) {
    console.log(`  skip (exists): ${path.basename(dest)}`);
    return;
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; photo-importer/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  console.log(`  saved: ${path.basename(dest)}`);
}

async function importAlbum(slug, pageUrl) {
  console.log(`\n[${slug}] Fetching album page...`);
  const html = await fetchHtml(pageUrl);
  const { photos, cover } = extractImageUrls(html);

  if (photos.length === 0) {
    console.warn(`  WARNING: no photos found for ${slug}. Page may have changed.`);
    return;
  }

  const dir = path.join(OUT_DIR, slug);
  mkdirSync(dir, { recursive: true });

  console.log(`  Found ${photos.length} photos${cover ? " + cover" : ""}`);

  for (let i = 0; i < photos.length; i++) {
    const filename = `${String(i + 1).padStart(3, "0")}.jpg`;
    await downloadFile(photos[i], path.join(dir, filename));
  }

  if (cover) {
    await downloadFile(cover, path.join(dir, "cover.jpg"));
  } else if (photos.length > 0 && !existsSync(path.join(dir, "cover.jpg"))) {
    // Fall back to first photo as cover
    await downloadFile(photos[0], path.join(dir, "cover.jpg"));
  }
}

async function main() {
  const filter = process.argv[2];
  const entries = filter
    ? Object.entries(ALBUMS).filter(([slug]) => slug === filter)
    : Object.entries(ALBUMS);

  if (entries.length === 0) {
    console.error(`No album found for slug: ${filter}`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  for (const [slug, url] of entries) {
    await importAlbum(slug, url);
  }

  console.log("\nDone. Update photo counts in data/albums.ts if needed.");
  console.log("Hint: ls -1 public/photos/<slug>/ | grep -v cover | wc -l");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
