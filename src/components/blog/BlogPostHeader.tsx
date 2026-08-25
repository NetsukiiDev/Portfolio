"use client";

import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { BlogPost } from "@/types";

export function BlogPostHeader({ post }: { post: BlogPost }) {
  const { locale } = useTranslation();
  const t = post.translations[locale];

  return (
    <header className="mx-auto max-w-2xl pt-32 pb-12 text-center">
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        {post.publishedAt && <span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>}
        <span>·</span>
        <span>{post.readingTime} min read</span>
      </div>
      <h1 className="mt-4 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">{t.title}</h1>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-white/[0.02]">
        <ImageWithFallback src={post.coverImage} alt={t.title} fill className="object-cover" />
      </div>
    </header>
  );
}
