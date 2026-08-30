"use client";

import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RevealOnScroll } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/cn";
import type { Locale } from "@/types";

/**
 * One band of the single-page site: an anchor the navbar can reach, a small
 * label, a heading, and an optional line under it.
 *
 * The heading and the line are both admin-written and arrive as whole
 * translation records, so a visitor switching language doesn't need another
 * request.
 */
export function HomeSection({
  id,
  eyebrow,
  heading,
  description,
  action,
  centered = false,
  className,
  children,
}: {
  id: string;
  eyebrow: string;
  heading: Record<Locale, string>;
  description?: Record<Locale, string>;
  /** A link to the fuller version, where one exists. */
  action?: ReactNode;
  /** For a band that reads as a display rather than as a list to work through. */
  centered?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const { locale } = useTranslation();
  const line = description?.[locale];

  return (
    <SectionWrapper id={id} className={cn("scroll-mt-20 border-t border-border", className)}>
      <Container>
        <RevealOnScroll>
          <div
            className={cn(
              "flex flex-wrap items-end justify-between gap-6",
              centered && "flex-col items-center text-center",
            )}
          >
            <div className={cn("max-w-2xl", centered && "mx-auto")}>
              <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground/70 uppercase">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-balance text-foreground sm:text-4xl">
                {heading[locale]}
              </h2>
              {line && <p className="mt-4 text-muted-foreground">{line}</p>}
            </div>
            {action}
          </div>
        </RevealOnScroll>

        <div className="mt-12">{children}</div>
      </Container>
    </SectionWrapper>
  );
}
