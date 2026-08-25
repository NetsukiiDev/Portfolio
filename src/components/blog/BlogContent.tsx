"use client";

import { Markdown } from "@/components/ui/Markdown";
import { useTranslation } from "@/hooks/useTranslation";
import type { BlogPost } from "@/types";

export function BlogContent({ post }: { post: BlogPost }) {
  const { locale } = useTranslation();
  const t = post.translations[locale];

  return <Markdown content={t.content} />;
}
