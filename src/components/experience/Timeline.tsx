"use client";

import { StaggerChildren, StaggerChild } from "@/components/animations";
import { TimelineItem } from "./TimelineItem";
import type { Experience } from "@/types";

export function Timeline({ items }: { items: Experience[] }) {
  const sorted = [...items].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <StaggerChildren className="mx-auto max-w-2xl space-y-4 pb-16">
      {sorted.map((item) => (
        <StaggerChild key={item.id}>
          <TimelineItem experience={item} />
        </StaggerChild>
      ))}
    </StaggerChildren>
  );
}
