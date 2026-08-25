"use client";

import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { useTranslation } from "@/hooks/useTranslation";
import type { Skill } from "@/types";

export function SkillCard({ skill }: { skill: Skill }) {
  const { locale } = useTranslation();
  const t = skill.translations[locale];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">{t.name}</h4>
        <span className="text-xs text-muted-foreground">{skill.yearsOfExperience}y</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
      <Progress value={skill.proficiency} className="mt-4" />
    </Card>
  );
}
