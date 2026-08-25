"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function FloatingBadge({
  icon: Icon,
  className,
  duration = 6,
  delay = 0,
}: {
  icon: LucideIcon;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "glass flex h-14 w-14 items-center justify-center rounded-2xl text-foreground shadow-xl",
        className,
      )}
    >
      <Icon className="h-6 w-6" strokeWidth={1.5} />
    </motion.div>
  );
}
