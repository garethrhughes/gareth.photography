"use client";

import Link from "next/link";
import type { Album } from "@/data/types";

interface AlbumGridProps {
  albums: Album[];
}

export default function AlbumGrid({ albums }: AlbumGridProps) {
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {albums.map((album) => (
          <Link
            key={album.slug}
            href={`/${album.slug}/`}
            className="relative group aspect-[4/3] overflow-hidden bg-surface-raised block rounded-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={album.coverImage}
              alt={album.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300"
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center">
              <span className="text-white text-sm font-medium tracking-widest uppercase">
                {album.title}
              </span>
              <span className="text-white/60 text-xs mt-1 tracking-wide">
                {album.year}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
