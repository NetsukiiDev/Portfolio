"use client";

import { RevealOnScroll } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/cn";

type PageKey = "about" | "projects" | "skills" | "experience" | "blog" | "aiGallery" | "contact";

export function PageHeader({ page, className }: { page: PageKey; className?: string }) {
  const { t } = useTranslation();

  return (
    <RevealOnScroll className={cn("mx-auto max-w-2xl pt-32 pb-16 text-center", className)}>
      <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">{t.nav[page]}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t.pages[page]}</p>
    </RevealOnScroll>
  );
}
