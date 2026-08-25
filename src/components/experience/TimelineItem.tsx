"use client";

import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Experience } from "@/types";

export function TimelineItem({ experience }: { experience: Experience }) {
  const { locale, t } = useTranslation();
  const item = experience.translations[locale];
  const start = format(new Date(experience.startDate), "MMM yyyy");
  const end = experience.current
    ? t.common.present
    : experience.endDate
      ? format(new Date(experience.endDate), "MMM yyyy")
      : "";

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge>{experience.type === "work" ? t.common.work : t.common.education}</Badge>
        <span className="text-xs text-muted-foreground">
          {start} – {end}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-medium tracking-tight text-foreground">{item.position}</h3>
      <p className="text-sm text-muted-foreground">{experience.company}</p>
      <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
      {item.highlights.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="text-accent">—</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
