"use client";

import { StaggerChildren, StaggerChild } from "@/components/animations";
import { GalleryCard } from "./GalleryCard";
import type { AiImage } from "@/types";

export function GalleryGrid({ images }: { images: AiImage[] }) {
  if (images.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">No images yet.</p>;
  }

  return (
    <StaggerChildren className="grid grid-cols-2 gap-4 pb-16 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <StaggerChild key={image.id}>
          <GalleryCard image={image} />
        </StaggerChild>
      ))}
    </StaggerChildren>
  );
}
