"use client";

import { useTranslation } from "@/hooks/useTranslation";

export function SkillsPreviewHeader() {
  const { t } = useTranslation();

  return <p className="text-sm font-medium text-muted-foreground">{t.common.toolsAndTech}</p>;
}
