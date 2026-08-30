"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { ROUTES } from "@/lib/constants";

export function NotFoundContent() {
  const { t } = useTranslation();

  return (
    // Pulled up under the fixed navbar and given the height back as
    // padding, the way the home hero does it: otherwise the starfield starts
    // below the navbar and leaves a seam across the top of the page.
    <section className="relative -mt-20 flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
      <div className="absolute inset-0">
        <div className="starfield-layer-1 animate-drift-1 absolute inset-0 opacity-80" />
        <div className="starfield-layer-2 animate-drift-2 absolute inset-0 opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 40%, rgba(124,108,246,0.16), transparent 55%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mx-auto flex max-w-lg flex-col items-center text-center"
      >
        <span className="text-8xl font-medium tracking-tight text-foreground sm:text-9xl">404</span>
        <p className="text-balance mt-6 max-w-sm text-lg text-muted-foreground">{t.notFound.subtitle}</p>
        <div className="mt-10">
          <ButtonLink href={ROUTES.home} size="lg">
            {t.notFound.cta}
          </ButtonLink>
        </div>
      </motion.div>
    </section>
  );
}
