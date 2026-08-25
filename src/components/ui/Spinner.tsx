import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-foreground", className)}
      role="status"
      aria-label="Loading"
    />
  );
}
