import { cn } from "@/lib/cn";

export function Progress({ value, className }: { value: number; className?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]", className)}>
      <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${clamped}%` }} />
    </div>
  );
}
