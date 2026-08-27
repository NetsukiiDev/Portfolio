"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAdmin } from "@/hooks/useAdmin";
import { ADMIN_SECTIONS } from "@/lib/admin-nav";
import { cn } from "@/lib/cn";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAdmin();
  const isAccountActive = pathname.startsWith("/admin/account");

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background-elevated/80 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/admin" className="text-sm font-semibold tracking-tight text-foreground">
          Admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
          aria-label="Apri menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold tracking-tight text-foreground">Admin</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
                aria-label="Chiudi menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto px-4 pt-4 pb-8">
              {ADMIN_SECTIONS.map((section, index) => (
                <div key={section.title ?? "root"} className={cn("flex flex-col gap-1", index > 0 && "mt-5")}>
                  {section.title && (
                    <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                      {section.title}
                    </p>
                  )}
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                      link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-colors",
                          isActive ? "bg-surface-wash-strong text-foreground" : "text-muted-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              ))}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-muted-foreground"
              >
                <ExternalLink className="h-5 w-5" />
                Apri Portfolio
              </a>
              <div className="mt-2 space-y-1 border-t border-border pt-2">
                <Link
                  href="/admin/account"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-colors",
                    isAccountActive ? "bg-surface-wash-strong text-foreground" : "text-muted-foreground",
                  )}
                >
                  <User className="h-5 w-5" />
                  Account
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-muted-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Esci
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
