"use client";

import { useState } from "react";
import type { Photo } from "@/data/types";
import Lightbox from "./Lightbox";

interface PhotoGridProps {
  photos: Photo[];
}

function getAspectRatio(photo: Photo): number {
  if (photo.width && photo.height) {
    return photo.width / photo.height;
  }
  return 3 / 2;
}

function isPortrait(photo: Photo): boolean {
  return getAspectRatio(photo) < 1;
}

// Arrange photos into rows that alternate between two patterns:
//   odd rows:  [landscape, portrait, landscape]  (2L + 1P)
//   even rows: [portrait, landscape, portrait]   (1L + 2P)
//
// This ensures every row has both orientations and adjacent rows
// look visually different. Falls back gracefully when one pool runs dry.
function buildRows(photos: Photo[], perRow: number): number[][] {
  const portraits = photos
    .map((p, i) => i)
    .filter((i) => isPortrait(photos[i]));
  const landscapes = photos
    .map((p, i) => i)
    .filter((i) => !isPortrait(photos[i]));

  // If only one orientation exists, just chunk sequentially
  if (portraits.length === 0 || landscapes.length === 0) {
    const all = photos.map((_, i) => i);
    const numRows = Math.ceil(all.length / perRow);
    return Array.from({ length: numRows }, (_, r) => {
      const remaining = all.length - r * perRow;
      const size = Math.ceil(remaining / (numRows - r));
      return all.slice(r * perRow, r * perRow + size);
    });
  }

  const rows: number[][] = [];
  let pi = 0; // portrait pool cursor
  let li = 0; // landscape pool cursor
  let rowIndex = 0;

  while (pi < portraits.length || li < landscapes.length) {
    const row: number[] = [];

    // Alternate pattern: odd rows favour landscape, even rows favour portrait
    // Pattern for perRow=3: [L,P,L] then [P,L,P] then [L,P,L] ...
    // Pattern for perRow=2: [L,P] then [P,L] then [L,P] ...
    const favourLandscape = rowIndex % 2 === 0;

    for (let slot = 0; slot < perRow; slot++) {
      // For perRow=3: slots 0,2 get majority; slot 1 gets minority
      // For perRow=2: slot 0 gets majority; slot 1 gets minority
      const wantMajority =
        perRow === 2
          ? slot === 0
          : slot !== Math.floor(perRow / 2);

      const wantLandscape = favourLandscape ? wantMajority : !wantMajority;

      if (wantLandscape && li < landscapes.length) {
        row.push(landscapes[li++]);
      } else if (!wantLandscape && pi < portraits.length) {
        row.push(portraits[pi++]);
      } else if (li < landscapes.length) {
        row.push(landscapes[li++]);
      } else if (pi < portraits.length) {
        row.push(portraits[pi++]);
      }
    }

    if (row.length > 0) rows.push(row);
    rowIndex++;
  }

  // If the last row has only 1 photo, move one from the previous row into it
  if (rows.length >= 2 && rows[rows.length - 1].length === 1) {
    const last = rows[rows.length - 1];
    const prev = rows[rows.length - 2];
    last.unshift(prev.pop()!);
  }

  return rows;
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const rows = buildRows(photos, 3);
  const mobileRows = buildRows(photos, 2);

  function renderGrid(rowSet: number[][], hidden: string) {
    return (
      <div className={`${hidden} px-4 py-4 md:px-8 flex flex-col gap-1`}>
        {rowSet.map((row, rowIdx) => {
          const rowAspect = row.reduce(
            (sum, i) => sum + getAspectRatio(photos[i]),
            0
          );
          const isLastRow = rowIdx === rowSet.length - 1;

          return (
            <div
              key={rowIdx}
              className="flex gap-1"
              style={isLastRow ? { justifyContent: "flex-start" } : undefined}
            >
              {row.map((photoIdx) => {
                const photo = photos[photoIdx];
                const ar = getAspectRatio(photo);
                const paddingBottom = `${(1 / ar) * 100}%`;

                return (
                  <button
                    key={photo.src}
                    onClick={() => setLightboxIndex(photoIdx)}
                    className="relative overflow-hidden bg-surface-raised group cursor-zoom-in"
                    aria-label={`Open photo: ${photo.alt}`}
                    style={
                      isLastRow
                        ? { width: `${(ar / rowAspect) * 100}%` }
                        : { flexGrow: ar / rowAspect, flexShrink: 1, flexBasis: 0 }
                    }
                  >
                    <div style={{ paddingBottom }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="absolute inset-0 w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {renderGrid(mobileRows, "sm:hidden")}
      {renderGrid(rows, "hidden sm:flex sm:flex-col")}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
