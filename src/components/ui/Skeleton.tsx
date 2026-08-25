import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-2xl bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03]",
        className,
      )}
    />
  );
}
