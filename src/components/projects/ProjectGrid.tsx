"use client";

import { StaggerChildren, StaggerChild } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const { t } = useTranslation();
  if (projects.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">{t.common.noProjects}</p>;
  }

  return (
    <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <StaggerChild key={project.id}>
          <ProjectCard project={project} />
        </StaggerChild>
      ))}
    </StaggerChildren>
  );
}
