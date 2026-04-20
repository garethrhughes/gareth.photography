"use client";

import { useEffect, useCallback } from "react";
import type { Photo } from "@/data/types";

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ photos, currentIndex, onClose, onNavigate }: LightboxProps) {
  const photo = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(currentIndex + 1);
    },
    [onClose, onNavigate, currentIndex, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-5 text-white/60 hover:text-white text-2xl leading-none transition-colors z-10 p-2"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      {/* Counter */}
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest">
        {currentIndex + 1} / {photos.length}
      </span>

      {/* Prev */}
      {hasPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-3xl p-4 transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          className="max-w-[90vw] max-h-[90vh] object-contain select-none"
          draggable={false}
        />
        {photo.alt && (
          <p className="absolute -bottom-8 left-0 right-0 text-center text-white/40 text-xs tracking-wide">
            {photo.alt}
          </p>
        )}
      </div>

      {/* Next */}
      {hasNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-3xl p-4 transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          aria-label="Next photo"
        >
          ›
        </button>
      )}
    </div>
  );
}
