import type { Locale } from "./index";

export type ProjectCategory = "fullstack" | "ai" | "web" | "mobile";

export interface ProjectTranslation {
  title: string;
  description: string;
  content: string;
}

/**
 * One image in a project's gallery. The first is the cover.
 *
 * The caption is translated like any other admin-written text — same shape
 * as the home page's stats, which is also an array of objects each carrying
 * their own translations.
 */
export interface ProjectImage {
  url: string;
  translations: Record<Locale, { caption: string }>;
}

export interface Project {
  id: string;
  slug: string;
  featured: boolean;
  order: number;
  category: ProjectCategory;
  images: ProjectImage[];
  links: {
    demo?: string;
    github?: string;
  };
  techStack: string[];
  translations: Record<Locale, ProjectTranslation>;
  createdAt: string;
  updatedAt: string;
}
