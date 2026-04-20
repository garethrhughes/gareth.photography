import { albums, getAlbumBySlug } from "@/data/albums";
import PhotoGrid from "@/components/PhotoGrid";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return albums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) return {};
  return {
    title: album.title,
    description: album.description ?? `${album.title} — photography by Gareth Hughes.`,
    openGraph: {
      title: `${album.title} — Gareth Hughes Photography`,
      images: [{ url: album.coverImage }],
    },
  };
}

export default async function AlbumPage({ params }: PageProps) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Album header */}
      <div className="px-4 py-8 max-w-6xl mx-auto md:px-6">
        <Link
          href="/"
          className="text-xs text-text-tertiary hover:text-text-primary tracking-widest uppercase transition-colors"
        >
          ← All albums
        </Link>
        <h1 className="mt-4 text-2xl font-light tracking-wide text-text-primary">{album.title}</h1>
        <p className="text-sm text-text-muted mt-1">{album.year}</p>
        {album.description && (
          <p className="mt-3 text-sm text-text-muted max-w-xl leading-relaxed">
            {album.description}
          </p>
        )}
      </div>

      <PhotoGrid photos={album.photos} />
    </div>
  );
}
