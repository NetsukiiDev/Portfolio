import type { Locale, ProjectCategory } from "@/types";
import type { translations } from "./translations";

type NavKey = keyof (typeof translations)["en"]["nav"];

export const SITE_NAME = "Portfolio";
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Locale[] = ["en", "it"];

export const ROUTES = {
  home: "/",
  about: "/about",
  projects: "/projects",
  skills: "/skills",
  experience: "/experience",
  blog: "/blog",
  aiGallery: "/ai-gallery",
  contact: "/contact",
} as const;

export const NAV_LINKS: { href: string; key: NavKey }[] = [
  { href: ROUTES.home, key: "home" },
  { href: ROUTES.about, key: "about" },
  { href: ROUTES.projects, key: "projects" },
  { href: ROUTES.skills, key: "skills" },
  { href: ROUTES.experience, key: "experience" },
  { href: ROUTES.blog, key: "blog" },
  { href: ROUTES.aiGallery, key: "aiGallery" },
  { href: ROUTES.contact, key: "contact" },
];

export const PROJECT_CATEGORIES: { id: ProjectCategory; label: Record<Locale, string> }[] = [
  { id: "fullstack", label: { en: "Full-Stack", it: "Full-Stack" } },
  { id: "ai", label: { en: "AI", it: "AI" } },
  { id: "web", label: { en: "Web", it: "Web" } },
  { id: "mobile", label: { en: "Mobile", it: "Mobile" } },
];

export const UPLOAD_FOLDERS = ["projects", "blog", "ai-gallery", "experience", "tools", "settings"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_UPLOAD_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"];
