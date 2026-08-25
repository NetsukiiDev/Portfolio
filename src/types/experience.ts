import type { Locale } from "./index";

export type ExperienceType = "work" | "education";

export interface ExperienceTranslation {
  position: string;
  description: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  type: ExperienceType;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
  company: string;
  logo: string;
  website?: string;
  translations: Record<Locale, ExperienceTranslation>;
}
