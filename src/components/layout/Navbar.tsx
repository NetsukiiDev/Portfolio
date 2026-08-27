"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Globe } from "lucide-react";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { useTranslation } from "@/hooks/useTranslation";
import { NAV_LINKS } from "@/lib/constants";
import { isNavKeyVisible, type ModulesSettings } from "@/lib/modules";
import { cn } from "@/lib/cn";

export function Navbar({
  modules,
  allowSwitch,
  siteName,
}: {
  modules: ModulesSettings;
  allowSwitch: boolean;
  siteName: string;
}) {
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();
  const links = NAV_LINKS.filter((link) => isNavKeyVisible(link.key, modules));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <Container className="flex h-20 items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            {siteName}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.nav[link.key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {allowSwitch && (
            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "it" : "en")}
              className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              aria-label={t.common.toggleLanguage}
            >
              <Globe className="h-3.5 w-3.5" />
              {locale.toUpperCase()}
            </button>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
              aria-label={t.common.openMenu}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </Container>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={links} allowSwitch={allowSwitch} />
    </>
  );
}
