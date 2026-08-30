import type { ReactNode } from "react";

/**
 * One item of a StaggerChildren group. It carries no animation of its own —
 * the parent's CSS drives the timing — so this is just the element the
 * stagger rule targets.
 */
export function StaggerChild({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
