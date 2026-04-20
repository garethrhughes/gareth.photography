"use client";

import { useState } from "react";
import type { Photo } from "@/data/types";
import Lightbox from "./Lightbox";

interface PhotoGridProps {
  photos: Photo[];
}

// Each photo needs a known aspect ratio to compute justified rows.
// We derive it from the Photo data (width/height) if present, otherwise
// fall back to a neutral 3/2 landscape ratio so layout still works.
function getAspectRatio(photo: Photo): number {
  if (photo.width && photo.height) {
    return photo.width / photo.height;
  }
  return 3 / 2;
}

// Distribute `count` photos into rows of `perRow` photos each,
// with remainder photos spread into earlier rows so all rows are
// as equal as possible (e.g. 6 photos at 3/row → [3,3], not [3,2,1]).
function buildRows(photos: Photo[], perRow: number): number[][] {
  const total = photos.length;
  const numRows = Math.ceil(total / perRow);
  const rows: number[][] = [];
  let idx = 0;
  for (let r = 0; r < numRows; r++) {
    // Distribute any remainder into the first rows
    const remaining = total - idx;
    const rowsLeft = numRows - r;
    const size = Math.ceil(remaining / rowsLeft);
    rows.push(
      Array.from({ length: size }, (_, i) => idx + i)
    );
    idx += size;
  }
  return rows;
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const PHOTOS_PER_ROW = 3;
  const rows = buildRows(photos, PHOTOS_PER_ROW);

  return (
    <>
      <div className="px-4 py-4 md:px-8 flex flex-col gap-1">
        {rows.map((row, rowIdx) => {
          const rowAspect = row.reduce(
            (sum, i) => sum + getAspectRatio(photos[i]),
            0
          );
          // Last row: don't stretch to fill — left-align at natural sizes
          const isLastRow = rowIdx === rows.length - 1;

          return (
            <div
              key={rowIdx}
              className="flex gap-1"
              style={isLastRow ? { justifyContent: "flex-start" } : undefined}
            >
              {row.map((photoIdx) => {
                const photo = photos[photoIdx];
                const ar = getAspectRatio(photo);
                // Each photo's flex-grow is proportional to its aspect ratio
                // so they fill the row evenly at equal height.
                const flexGrow = ar / rowAspect;
                // padding-bottom trick gives each item its correct intrinsic height
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
                        : { flexGrow, flexShrink: 1, flexBasis: 0 }
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
