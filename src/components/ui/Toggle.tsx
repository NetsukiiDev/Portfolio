"use client";

import { cn } from "@/lib/cn";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <label className={cn("flex w-fit cursor-pointer select-none items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full border border-border-strong transition-colors",
          checked ? "bg-accent" : "bg-surface-wash-strong",
        )}
      >
        {/* The track is 24px tall with a 1px border, so its inside is 22px:
            a 20px knob has exactly 1px to spare on each side. Insetting it by
            2px, as it was, left 2px above and none below. */}
        <span
          className={cn(
            "absolute top-px left-px h-5 w-5 rounded-full bg-white transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  );
}
