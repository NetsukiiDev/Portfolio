"use client";

import { StaggerChildren, StaggerChild } from "@/components/animations";
import { SkillCard } from "./SkillCard";
import { useTranslation } from "@/hooks/useTranslation";
import type { SkillCategory, Skill } from "@/types";

export function SkillGrid({ categories, skills }: { categories: SkillCategory[]; skills: Skill[] }) {
  const { locale } = useTranslation();
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-16">
      {sortedCategories.map((category) => {
        const categorySkills = skills
          .filter((skill) => skill.categoryId === category.id)
          .sort((a, b) => a.order - b.order);

        if (categorySkills.length === 0) return null;

        return (
          <div key={category.id}>
            <h2 className="mb-6 text-xl font-medium tracking-tight text-foreground">
              {category.translations[locale].name}
            </h2>
            <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categorySkills.map((skill) => (
                <StaggerChild key={skill.id}>
                  <SkillCard skill={skill} />
                </StaggerChild>
              ))}
            </StaggerChildren>
          </div>
        );
      })}
    </div>
  );
}
