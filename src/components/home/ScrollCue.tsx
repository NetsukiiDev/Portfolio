import { cn } from "@/lib/cn";

/**
 * The hint at the foot of the hero: a mouse with its wheel rolling down.
 *
 * Purely an affordance — it says nothing a screen reader needs, and the page
 * scrolls whether or not anyone notices it — so it's hidden from assistive
 * technology rather than announced.
 */
export function ScrollCue({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center", className)} aria-hidden>
      <span className="flex h-10 w-6 justify-center rounded-full border-2 border-muted-foreground/40 pt-2">
        <span className="animate-scroll-wheel h-1.5 w-1 rounded-full bg-muted-foreground/70" />
      </span>
    </div>
  );
}
