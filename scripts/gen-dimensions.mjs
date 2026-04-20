#!/usr/bin/env node
/**
 * scripts/gen-dimensions.mjs
 *
 * Reads all *.jpg photos under public/photos/<album>/ and outputs a
 * TypeScript `dimensions` object suitable for pasting into data/albums.ts.
 *
 * Usage:
 *   node scripts/gen-dimensions.mjs
 *
 * Requires: sharp (already a Next.js dependency)
 */

import sharp from "sharp";
import { readdir } from "fs/promises";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const photosDir = join(__dirname, "../public/photos");

const albums = (await readdir(photosDir, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const result = {};

for (const album of albums) {
  const albumDir = join(photosDir, album);
  const files = (await readdir(albumDir))
    .filter((f) => f.endsWith(".jpg") && f !== "cover.jpg")
    .sort();

  if (files.length === 0) continue;

  result[album] = {};
  for (const file of files) {
    const { width, height } = await sharp(join(albumDir, file)).metadata();
    result[album][file] = { width, height };
  }
}

// Pretty-print as a TypeScript object literal
const lines = ["const dimensions: Record<string, Record<string, { width: number; height: number }>> = {"];

for (const [album, photos] of Object.entries(result)) {
  lines.push(`  "${album}": {`);
  for (const [file, { width, height }] of Object.entries(photos)) {
    lines.push(`    "${file}": { width: ${width}, height: ${height} },`);
  }
  lines.push(`  },`);
}

lines.push("};");

console.log(lines.join("\n"));
