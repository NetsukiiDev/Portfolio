"use client";

import { StaggerChildren, StaggerChild } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import { GalleryCard } from "./GalleryCard";
import type { AiImage } from "@/types";

export function GalleryGrid({ images }: { images: AiImage[] }) {
  const { t } = useTranslation();
  if (images.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">{t.common.noImages}</p>;
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
