import { albums } from "@/data/albums";
import AlbumGrid from "@/components/AlbumGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gareth Hughes Photography",
  description: "Photography by Gareth Hughes — landscapes, wildlife, and nature across Australia.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AlbumGrid albums={albums} />
    </div>
  );
}
