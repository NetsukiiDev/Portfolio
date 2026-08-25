"use client";

import { Progress } from "@/components/ui/Progress";
import { useTranslation } from "@/hooks/useTranslation";
import type { Skill } from "@/types";

export function SkillBar({ skill }: { skill: Skill }) {
  const { locale } = useTranslation();
  const t = skill.translations[locale];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{t.name}</span>
        <span className="text-muted-foreground">{skill.proficiency}%</span>
      </div>
      <Progress value={skill.proficiency} />
    </div>
  );
}
