"use client";

import { StaggerChildren, StaggerChild } from "@/components/animations";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">No projects match this filter yet.</p>;
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
