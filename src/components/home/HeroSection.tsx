"use client";

import { HeroBackground } from "./HeroBackground";
import { HeroSocials } from "./HeroSocials";
import { HeroCurrently } from "./HeroCurrently";
import { AnimatedText } from "@/components/animations";
import { ButtonLink } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { ROUTES } from "@/lib/constants";
import type { ToolIcon } from "@/lib/tools/catalogue";
import type { HomeSettings } from "@/types/settings";
import type { Experience, Settings } from "@/types";

/**
 * Two columns: who you are on the left, what you're doing now on the right.
 *
 * The right column is the Experience module, not a second copy of it, so it
 * can't fall out of date — and with nothing in it the hero simply becomes
 * one column rather than showing an empty frame.
 */
export function HeroSection({
  home,
  social,
  socialIcons,
  experience,
}: {
  home: HomeSettings;
  social: Settings["social"];
  socialIcons: Record<string, ToolIcon | null>;
  experience: Experience[];
}) {
  // Copy comes from the database (Admin → Portfolio); only the locale to pick
  // is client state.
  const { t, locale } = useTranslation();
  const text = home.translations[locale];
  const hasAside = experience.length > 0;

  return (
    <section className="relative -mt-20 overflow-hidden px-6 pt-20">
      <HeroBackground />

      {text.availability && (
        <div className="relative z-10 flex justify-end pt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-wash px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="animate-glow-pulse h-1.5 w-1.5 rounded-full bg-accent" />
            {text.availability}
          </span>
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl items-center py-16">
        <div
          className={
            hasAside
              ? "grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1fr)_auto]"
              : "w-full"
          }
        >
          <div className="max-w-2xl">
            {text.kicker && (
              <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                {text.kicker}
              </p>
            )}

            <h1 className="mt-5 text-5xl font-medium tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {/* Every line after the first is drawn as an outline, which is
                  what gives a two-line name its weight without doubling it. */}
              <AnimatedText text={text.title} outlineFrom={1} />
            </h1>

            {text.subtitle && (
              <p className="text-balance mt-8 text-xl font-medium text-foreground sm:text-2xl">
                {text.subtitle}
              </p>
            )}

            {text.intro && <p className="mt-4 max-w-lg text-muted-foreground">{text.intro}</p>}

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href={ROUTES.projects} size="lg">
                {text.ctaPrimary}
              </ButtonLink>
              <ButtonLink href={ROUTES.contact} size="lg" variant="secondary">
                {text.ctaSecondary}
              </ButtonLink>
            </div>

            <HeroSocials social={social} icons={socialIcons} className="mt-8" />
          </div>

          {hasAside && (
            <div className="flex justify-start lg:justify-end">
              <HeroCurrently entries={experience} />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 pb-10">
        <span className="text-[10px] font-medium tracking-[0.3em] text-muted-foreground/60 uppercase">
          {t.common.scroll}
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-border-strong to-transparent" />
      </div>
    </section>
  );
}
