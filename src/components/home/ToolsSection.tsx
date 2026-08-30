import { TextMarquee } from "@/components/animations";
import { HomeSection } from "./HomeSection";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { findToolIcon } from "@/lib/tools/catalogue";
import { getSectionText } from "@/lib/site.server";
import type { Tool } from "@/types";
import type { ToolsDisplay } from "@/types/settings";

/** Past this many, a still grid starts to look like a wall and scrolls instead. */
const MARQUEE_THRESHOLD = 8;

/**
 * Seconds per item, rather than one duration for the whole strip: however
 * many there are, they travel at the same speed instead of a long row
 * racing to finish in the same time a short one takes.
 */
const SECONDS_PER_TOOL = 5;
const MIN_MARQUEE_SECONDS = 24;

function ToolBadge({ tool }: { tool: Tool }) {
  // A catalogue pick draws its own vector; a manual entry falls back to the
  // logo that was uploaded for it.
  const icon = findToolIcon(tool.slug);
  const label = icon?.title ?? tool.name ?? "";

  const content = (
    <>
      {icon ? (
        <ToolLogo icon={icon} brand className="h-8 w-8" />
      ) : (
        <span className="relative h-8 w-8 shrink-0 overflow-hidden">
          <ImageWithFallback src={tool.image ?? ""} alt="" fill className="object-contain" />
        </span>
      )}
      <span className="text-base whitespace-nowrap text-foreground">{label}</span>
    </>
  );

  const className =
    "inline-flex items-center gap-3 rounded-full border border-border bg-white/[0.03] px-6 py-3.5 transition-colors hover:border-border-strong";

  if (!tool.url) return <span className={className}>{content}</span>;

  return (
    <a href={tool.url} target="_blank" rel="noreferrer noopener" className={className}>
      {content}
    </a>
  );
}

/**
 * One strip of everything, in the order set in the admin.
 *
 * Either still, or scrolling on its own — and the scrolling kind is
 * deliberately inert: nothing to drag, nothing to pause, no buttons, so it
 * reads as motion rather than as something asking to be operated.
 */
export async function ToolsSection({ tools, display }: { tools: Tool[]; display: ToolsDisplay }) {
  const visible = [...tools].sort((a, b) => a.order - b.order);
  if (visible.length === 0) return null;

  const scrolling = display === "marquee" || (display === "auto" && visible.length > MARQUEE_THRESHOLD);
  const heading = await getSectionText("tools");

  return (
    <HomeSection id="tools" eyebrow="Stack" heading={heading}>
      {scrolling ? (
        // Faded at both ends so items enter and leave rather than being cut
        // off mid-badge.
        <div
          className="[--fade:6rem] [mask-image:linear-gradient(to_right,transparent,black_var(--fade),black_calc(100%-var(--fade)),transparent)]"
          // The strip repeats itself, so screen readers get it once.
          aria-label={visible.map((tool) => findToolIcon(tool.slug)?.title ?? tool.name).join(", ")}
        >
          <TextMarquee duration={Math.max(MIN_MARQUEE_SECONDS, visible.length * SECONDS_PER_TOOL)}>
            {visible.map((tool) => (
              <ToolBadge key={tool.id} tool={tool} />
            ))}
          </TextMarquee>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {visible.map((tool) => (
            <ToolBadge key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </HomeSection>
  );
}
