import { cn } from "@/lib/cn";
import type { ToolIcon } from "@/lib/tools/catalogue";

/**
 * A catalogue logo, drawn inline. Simple Icons ships path data rather than
 * files, so this needs no request, scales cleanly, and can be tinted.
 *
 * `brand` paints it in the mark's own colour; without it the logo takes the
 * surrounding text colour, which keeps a row of them looking like one set
 * rather than a bag of clashing hues.
 */
export function ToolLogo({
  icon,
  brand = false,
  className,
}: {
  icon: ToolIcon;
  brand?: boolean;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={icon.title}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      fill={brand ? `#${icon.hex}` : "currentColor"}
    >
      <path d={icon.path} />
    </svg>
  );
}
