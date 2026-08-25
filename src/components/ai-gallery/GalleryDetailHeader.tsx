"use client";

import { useTranslation } from "@/hooks/useTranslation";
import type { AiImage } from "@/types";

export function GalleryDetailHeader({ image }: { image: AiImage }) {
  const { locale } = useTranslation();
  const t = image.translations[locale];

  return (
    <header className="mx-auto max-w-2xl pt-32 pb-12 text-center">
      <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">{t.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
    </header>
  );
}
