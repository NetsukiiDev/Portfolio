"use client";

import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import type { Project } from "@/types";

export function ProjectDetailHeader({ project }: { project: Project }) {
  const { locale } = useTranslation();
  const t = project.translations[locale];

  return (
    <header className="mx-auto max-w-3xl pt-32 pb-12 text-center">
      <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">{t.title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{t.description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {project.techStack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-white"
          >
            Live demo <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
          >
            Source code <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-white/[0.02]">
        <ImageWithFallback src={project.images[0]} alt={t.title} fill className="object-cover" />
      </div>
    </header>
  );
}
