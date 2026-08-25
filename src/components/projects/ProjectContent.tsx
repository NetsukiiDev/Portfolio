"use client";

import { Markdown } from "@/components/ui/Markdown";
import { useTranslation } from "@/hooks/useTranslation";
import type { Project } from "@/types";

export function ProjectContent({ project }: { project: Project }) {
  const { locale } = useTranslation();
  const t = project.translations[locale];

  return <Markdown content={t.content} />;
}
