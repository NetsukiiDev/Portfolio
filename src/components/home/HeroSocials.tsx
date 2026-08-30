"use client";

import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ToolIcon } from "@/lib/tools/catalogue";
import type { Settings } from "@/types";

/**
 * The social row under the hero buttons.
 *
 * Marks come from Simple Icons, the same set the tools strip draws from —
 * lucide dropped its brand icons. LinkedIn isn't in that set (removed at the
 * brand's request), so anything without a mark falls back to a link glyph
 * rather than being left out.
 */
export function HeroSocials({
  social,
  icons,
  className,
}: {
  social: Settings["social"];
  icons: Record<string, ToolIcon | null>;
  className?: string;
}) {
  const entries = (Object.entries(social) as [keyof Settings["social"], string | null][]).filter(
    (entry): entry is [keyof Settings["social"], string] => Boolean(entry[1]),
  );

  if (entries.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {entries.map(([key, href]) => {
        const icon = icons[key];
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={icon?.title ?? key}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-wash text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            {icon ? (
              <svg role="img" aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d={icon.path} />
              </svg>
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
          </a>
        );
      })}
    </div>
  );
}
