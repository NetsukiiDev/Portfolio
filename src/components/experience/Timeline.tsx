"use client";

import { StaggerChildren, StaggerChild } from "@/components/animations";
import { TimelineItem } from "./TimelineItem";
import type { Experience } from "@/types";

export function Timeline({ items }: { items: Experience[] }) {
  // The order set by dragging in the admin, not the dates: a CV is usually
  // reverse-chronological, but not always — and a control that doesn't reach
  // the page is worse than no control.
  const sorted = [...items].sort((a, b) => a.order - b.order);

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
