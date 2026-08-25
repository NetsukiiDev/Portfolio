"use client";

import { StaggerChildren, StaggerChild } from "@/components/animations";
import { BlogCard } from "./BlogCard";
import type { BlogPost } from "@/types";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">No posts published yet.</p>;
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
