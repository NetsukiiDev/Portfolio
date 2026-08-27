"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, ExternalLink } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { ADMIN_SECTIONS } from "@/lib/admin-nav";
import { cn } from "@/lib/cn";

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdmin();
  const isAccountActive = pathname.startsWith("/admin/account");

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-background-elevated/60 p-4 lg:flex">
      <Link href="/admin" className="px-2 py-3 text-sm font-semibold tracking-tight text-foreground">
        Admin
      </Link>
      <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
        {ADMIN_SECTIONS.map((section, index) => (
          <div key={section.title ?? "root"} className={cn("flex flex-col gap-1", index > 0 && "mt-5")}>
            {section.title && (
              <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </p>
            )}
            {section.links.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-surface-wash-strong text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
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
          className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          Apri Portfolio
        </a>
      </nav>
      <div className="space-y-1 border-t border-border pt-2">
        <Link
          href="/admin/account"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isAccountActive ? "bg-surface-wash-strong text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <User className="h-4 w-4" />
          Account
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Esci
        </button>
      </div>
    </aside>
  );
}
