"use client";

import { Code2, Sparkles, Boxes, Palette } from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { FloatingBadge, AnimatedText } from "@/components/animations";
import { ButtonLink } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { ROUTES } from "@/lib/constants";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative -mt-20 flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pt-20">
      <HeroBackground />

      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <FloatingBadge icon={Code2} className="pointer-events-auto absolute top-[28%] left-[12%]" duration={7} />
        <FloatingBadge
          icon={Sparkles}
          className="pointer-events-auto absolute top-[22%] right-[14%]"
          duration={8}
          delay={0.5}
        />
        <FloatingBadge
          icon={Boxes}
          className="pointer-events-auto absolute bottom-[24%] left-[18%]"
          duration={6.5}
          delay={1}
        />
        <FloatingBadge
          icon={Palette}
          className="pointer-events-auto absolute right-[16%] bottom-[30%]"
          duration={7.5}
          delay={1.5}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface-wash px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="animate-glow-pulse h-1.5 w-1.5 rounded-full bg-accent" />
          {t.home.heroKicker}
        </span>

        <h1 className="text-balance text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl">
          <AnimatedText text={t.home.heroTitle} />
        </h1>

        <p className="text-balance mx-auto mt-6 max-w-xl text-lg text-muted-foreground">{t.home.heroSubtitle}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href={ROUTES.projects} size="lg">
            {t.home.ctaPrimary}
          </ButtonLink>
          <ButtonLink href={ROUTES.contact} size="lg" variant="secondary">
            {t.home.ctaSecondary}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
