import { cn } from "@/lib/cn";
import type { SetupStep } from "@/lib/setup";

const STEPS: { key: Exclude<SetupStep, "complete">; label: string }[] = [
  { key: "database", label: "Database" },
  { key: "account", label: "Account" },
  { key: "site", label: "Sito" },
];

export function SetupStepper({ current }: { current: SetupStep }) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);

  return (
    <div className="mb-8 flex items-center gap-2 sm:gap-3">
      {STEPS.map((step, index) => (
        <div key={step.key} className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                index < currentIndex && "bg-accent text-white",
                index === currentIndex && "border border-accent text-foreground",
                index > currentIndex && "border border-border text-muted-foreground",
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm sm:inline",
                index === currentIndex ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && <div className="h-px w-5 shrink-0 bg-border sm:w-8" />}
        </div>
      ))}
    </div>
  );
}
