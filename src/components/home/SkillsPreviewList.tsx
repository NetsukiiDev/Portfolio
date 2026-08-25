"use client";

import { RevealOnScroll } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import type { Skill } from "@/types";

export function SkillsPreviewList({ skills }: { skills: Skill[] }) {
  const { locale } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {skills.map((skill, index) => (
        <RevealOnScroll key={skill.id} delay={index * 0.03}>
          <span className="inline-flex items-center rounded-full border border-border bg-white/[0.03] px-4 py-2 text-sm text-foreground">
            {skill.translations[locale].name}
          </span>
        </RevealOnScroll>
      ))}
    </div>
  );
}
