"use client";

import { useMemo, useState } from "react";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectGrid } from "./ProjectGrid";
import type { Project, ProjectCategory } from "@/types";

export function ProjectsPageClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((project) => project.category === active)),
    [projects, active],
  );

  return (
    <div>
      <ProjectFilters active={active} onChange={setActive} />
      <div className="mt-12 pb-16">
        <ProjectGrid projects={filtered} />
      </div>
    </div>
  );
}
