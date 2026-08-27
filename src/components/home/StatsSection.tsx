"use client";

import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedCounter, RevealOnScroll } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import type { GithubStats } from "@/lib/github";
import type { HomeStat } from "@/types/settings";

export function StatsSection({ stats, values }: { stats: HomeStat[]; values: GithubStats }) {
  // Labels are editable (Admin → Portfolio); the figures come from GitHub.
  const { locale } = useTranslation();

  if (stats.length === 0) return null;

  return (
    <SectionWrapper className="border-t border-border">
      <Container>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <RevealOnScroll key={stat.key} delay={index * 0.05} className="text-center">
              <p className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                <AnimatedCounter value={values[stat.key]} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.translations[locale].label}</p>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
