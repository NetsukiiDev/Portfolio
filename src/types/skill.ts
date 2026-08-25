import type { Locale } from "./index";

export interface SkillCategory {
  id: string;
  order: number;
  translations: Record<Locale, { name: string }>;
}

export interface Skill {
  id: string;
  categoryId: string;
  icon: string;
  proficiency: number;
  yearsOfExperience: number;
  order: number;
  translations: Record<Locale, { name: string; description: string }>;
}

export interface SkillsData {
  categories: SkillCategory[];
  skills: Skill[];
}
