"use client";

import { StaggerChildren, StaggerChild } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import { BlogCard } from "./BlogCard";
import type { BlogPost } from "@/types";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const { t } = useTranslation();
  if (posts.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">{t.common.noPosts}</p>;
  }

  return (
    <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <StaggerChild key={post.id}>
          <BlogCard post={post} />
        </StaggerChild>
      ))}
    </StaggerChildren>
  );
}
