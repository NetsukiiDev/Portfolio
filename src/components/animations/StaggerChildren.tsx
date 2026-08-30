"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";

/**
 * Animates its direct children in, one shortly after another. The stagger is
 * a CSS rule on this element, so a child needs to know nothing about its own
 * position — and a child that never gets animated is still visible.
 */
export function StaggerChildren({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>("-60px");

  return (
    <div ref={ref} className={cn(className, inView && "stagger-in")}>
      {children}
    </div>
  );
}
