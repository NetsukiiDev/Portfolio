"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import type { BlogPost } from "@/types";

export function BlogCard({ post }: { post: BlogPost }) {
  const { locale } = useTranslation();
  const t = post.translations[locale];

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="overflow-hidden transition-colors group-hover:border-border-strong">
        <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.02]">
          <ImageWithFallback
            src={post.coverImage}
            alt={t.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {post.publishedAt && <span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>}
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
          <h3 className="mt-3 text-lg font-medium tracking-tight text-foreground">{t.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t.excerpt}</p>
        </div>
      </Card>
    </Link>
  );
}
