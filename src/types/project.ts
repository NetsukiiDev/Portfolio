import type { Locale } from "./index";

export type ProjectCategory = "fullstack" | "ai" | "web" | "mobile";

export interface ProjectTranslation {
  title: string;
  description: string;
  content: string;
}

export interface Project {
  id: string;
  slug: string;
  featured: boolean;
  order: number;
  category: ProjectCategory;
  images: string[];
  links: {
    demo?: string;
    github?: string;
  };
  techStack: string[];
  translations: Record<Locale, ProjectTranslation>;
  createdAt: string;
  updatedAt: string;
}
