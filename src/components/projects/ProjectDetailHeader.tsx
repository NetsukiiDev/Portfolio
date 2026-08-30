"use client";

import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import type { Project } from "@/types";

/**
 * Left-aligned rather than centred: a title, a paragraph and a row of buttons
 * all centred read as a landing page, and this is a page you read.
 *
 * The cover is only drawn when there is one — an empty framed box tells the
 * visitor nothing except that something is missing.
 */
export function ProjectDetailHeader({ project }: { project: Project }) {
  const { locale } = useTranslation();
  const t = project.translations[locale];
  const cover = project.images[0];
  const category = PROJECT_CATEGORIES.find((entry) => entry.id === project.category);

  return (
    <header className="pt-32">
      <div className="max-w-3xl">
        {category && <Badge>{category.label[locale]}</Badge>}
        <h1 className="mt-4 text-4xl font-medium tracking-tight text-balance text-foreground sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
      </div>

      {cover && (
        <figure className="mt-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-white/[0.02]">
            <ImageWithFallback src={cover.url} alt={t.title} fill className="object-cover" priority />
          </div>
          {cover.translations[locale]?.caption && (
            <figcaption className="mt-3 text-sm text-muted-foreground">
              {cover.translations[locale].caption}
            </figcaption>
          )}
        </figure>
      )}
    </header>
  );
}
