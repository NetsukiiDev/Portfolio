import { cn } from "@/lib/cn";
import { getSetupT, type WizardLang } from "@/lib/setup-translations";
import type { SetupStep } from "@/lib/setup";

export function SetupStepper({ current, lang }: { current: SetupStep; lang: WizardLang }) {
  const t = getSetupT(lang);
  const steps: { key: Exclude<SetupStep, "complete">; label: string }[] = [
    { key: "database", label: t.stepper.database },
    { key: "account", label: t.stepper.account },
    { key: "site", label: t.stepper.site },
  ];
  const currentIndex = steps.findIndex((step) => step.key === current);

  return (
    <div className="mb-8 flex items-center gap-2 sm:gap-3">
      {steps.map((step, index) => (
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
          {index < steps.length - 1 && <div className="h-px w-5 shrink-0 bg-border sm:w-8" />}
        </div>
      ))}
    </div>
  );
}
