import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function SectionWrapper({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-24 md:py-32", className)} {...props} />;
}
