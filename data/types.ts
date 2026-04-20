export interface Photo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Album {
  slug: string;
  title: string;
  year: number;
  coverImage: string;
  description?: string;
  photos: Photo[];
}
