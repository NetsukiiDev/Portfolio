"use client";

import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedCounter, RevealOnScroll } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import type { HomeStat } from "@/types/settings";

export function StatsSection({ stats }: { stats: HomeStat[] }) {
  // Figures and labels come from the database (Admin → Portfolio).
  const { locale } = useTranslation();

  if (stats.length === 0) return null;

  return (
    <SectionWrapper className="border-t border-border">
      <Container>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <RevealOnScroll key={index} delay={index * 0.05} className="text-center">
              <p className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.translations[locale].label}</p>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
