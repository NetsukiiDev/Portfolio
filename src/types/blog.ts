import type { Locale } from "./index";

export type BlogStatus = "published" | "draft";

export interface BlogTranslation {
  title: string;
  excerpt: string;
  content: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  status: BlogStatus;
  coverImage: string;
  tags: string[];
  readingTime: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  translations: Record<Locale, BlogTranslation>;
}
