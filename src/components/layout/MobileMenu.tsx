"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { NAV_LINKS } from "@/lib/constants";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
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
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex flex-col items-center gap-6 px-6 pt-8">
            {NAV_LINKS.map((link, index) => (
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
            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "it" : "en")}
              className="mt-4 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground"
            >
              {locale === "en" ? "Switch to Italiano" : "Switch to English"}
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
