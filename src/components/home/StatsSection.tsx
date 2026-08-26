"use client";

import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedCounter, RevealOnScroll } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";

// Placeholders — put your own figures here. Left at zero rather than
// invented numbers so nothing on a fresh install claims to be true.
const STATS = [
  { value: 0, suffix: "", key: "statsProjects" as const },
  { value: 0, suffix: "", key: "statsExperience" as const },
  { value: 0, suffix: "", key: "statsClients" as const },
  { value: 0, suffix: "", key: "statsCoffee" as const },
];

export function StatsSection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper className="border-t border-border">
      <Container>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat, index) => (
            <RevealOnScroll key={stat.key} delay={index * 0.05} className="text-center">
              <p className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{t.home[stat.key]}</p>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
