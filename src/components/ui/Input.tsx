import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-border bg-surface-wash px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
