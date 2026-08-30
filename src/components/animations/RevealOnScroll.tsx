"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";

export function RevealOnScroll({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>("-80px");

  return (
    <div
      ref={ref}
      className={cn(className, inView && "animate-reveal-in")}
      style={inView ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
