import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function TextMarquee({
  children,
  /** Seconds for one full pass. Scale it with the content, not the container. */
  duration = 30,
  className,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee gap-12"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <div className="flex shrink-0 gap-12">{children}</div>
        <div className="flex shrink-0 gap-12" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
