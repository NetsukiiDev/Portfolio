"use client";

import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { BlurReveal } from "@/components/animations";
import { useTranslation } from "@/hooks/useTranslation";
import { ROUTES } from "@/lib/constants";

export function CallToAction() {
  const { t } = useTranslation();

  return (
    <SectionWrapper className="border-t border-border">
      <Container>
        <BlurReveal>
          <Card className="relative overflow-hidden px-8 py-16 text-center sm:px-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(124,108,246,0.18), transparent 60%)",
              }}
            />
            <div className="relative">
              <h2 className="text-balance text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
                {t.home.ctaSecondary}?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">{t.home.heroSubtitle}</p>
              <div className="mt-8">
                <ButtonLink href={ROUTES.contact} size="lg">
                  {t.home.ctaSecondary}
                </ButtonLink>
              </div>
            </div>
          </Card>
        </BlurReveal>
      </Container>
    </SectionWrapper>
  );
}
