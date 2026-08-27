"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { NAV_LINKS } from "@/lib/constants";

export function MobileMenu({
  open,
  onClose,
  links,
  allowSwitch,
}: {
  open: boolean;
  onClose: () => void;
  /** Already filtered by the active modules — see Navbar. */
  links: typeof NAV_LINKS;
  allowSwitch: boolean;
}) {
  const { t, locale, setLocale } = useTranslation();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <div className="flex h-20 items-center justify-end px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
              aria-label={t.common.closeMenu}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex flex-col items-center gap-6 px-6 pt-8">
            {links.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-3xl font-medium tracking-tight text-foreground"
                >
                  {t.nav[link.key]}
                </Link>
              </motion.div>
            ))}
            {allowSwitch && (
              <button
                type="button"
                onClick={() => setLocale(locale === "en" ? "it" : "en")}
                className="mt-4 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground"
              >
                {locale === "en" ? "Passa all'italiano" : "Switch to English"}
              </button>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
