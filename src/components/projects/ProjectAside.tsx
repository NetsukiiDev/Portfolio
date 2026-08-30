"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Project } from "@/types";

/**
 * The facts about a project — where to see it, what it's built with — kept
 * beside the writing instead of stacked above it, so the prose starts at the
 * top of the column and the links stay reachable while you read.
 */
export function ProjectAside({ project }: { project: Project }) {
  const { t } = useTranslation();
  const { demo, github } = project.links;

  if (!demo && !github && project.techStack.length === 0) return null;

  return (
    <aside className="h-max space-y-8 lg:sticky lg:top-28">
      {(demo || github) && (
        <div className="flex flex-col gap-2">
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-white"
            >
              {t.common.liveDemo} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-2 rounded-full border border-border-strong px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
            >
              {t.common.sourceCode} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}

      {project.techStack.length > 0 && (
        <div>
          <h2 className="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
            {t.common.builtWith}
          </h2>
          <ul className="mt-3 space-y-1.5">
            {project.techStack.map((tech) => (
              <li key={tech} className="text-sm text-muted-foreground">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
