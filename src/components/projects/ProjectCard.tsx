"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const { locale } = useTranslation();
  const t = project.translations[locale];
  const cover = project.images[0];

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <Card className="overflow-hidden transition-colors group-hover:border-border-strong">
        {cover && (
          <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02]">
            <ImageWithFallback
              src={cover.url}
              alt={t.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
            <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-medium tracking-tight text-foreground">{t.title}</h3>
            {!cover && (
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            )}
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
