"use client";

import { useTranslation } from "@/hooks/useTranslation";
import type { Locale } from "@/types";

export function SkillsPreviewHeader({ heading }: { heading: Record<Locale, string> }) {
  const { locale } = useTranslation();

  return <p className="text-sm font-medium text-muted-foreground">{heading[locale]}</p>;
}
