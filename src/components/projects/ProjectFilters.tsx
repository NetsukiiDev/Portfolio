"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { ProjectCategory } from "@/types";

export function ProjectFilters({
  active,
  onChange,
}: {
  active: ProjectCategory | "all";
  onChange: (category: ProjectCategory | "all") => void;
}) {
  const { locale } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          active === "all"
            ? "border-transparent bg-foreground text-background"
            : "border-border text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </button>
      {PROJECT_CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            active === category.id
              ? "border-transparent bg-foreground text-background"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {category.label[locale]}
        </button>
      ))}
    </div>
  );
}
