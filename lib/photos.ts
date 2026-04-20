/**
 * Returns the base URL for photos.
 *
 * - In development (or when NEXT_PUBLIC_CDN_URL is unset): serve from /photos/
 * - In production: serve from the CDN (NEXT_PUBLIC_CDN_URL env var)
 */
export function photoBase(): string {
  if (process.env.NEXT_PUBLIC_CDN_URL) {
    return process.env.NEXT_PUBLIC_CDN_URL.replace(/\/$/, "");
  }
  return "/photos";
}

export function photoUrl(slug: string, filename: string): string {
  return `${photoBase()}/${slug}/${filename}`;
}
