"use client";

import { cn } from "@/lib/cn";

/**
 * The headline, revealed a line at a time from behind its own mask.
 *
 * Deliberately CSS rather than JavaScript: the lines' resting position is
 * where they belong, and the animation only displaces them on the way in. It
 * used to render them pushed out of view and rely on JS to bring them back,
 * which left the page's title invisible whenever that didn't run.
 */
export function AnimatedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const lines = text.split("\n");

  return (
    <span className={cn("block", className)}>
      {lines.map((line, lineIndex) => (
        <span key={line} className="block overflow-hidden">
          <span
            className="animate-reveal-up block"
            style={{ animationDelay: `${delay + lineIndex * 0.08}s` }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
