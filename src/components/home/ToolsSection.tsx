import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RevealOnScroll, TextMarquee } from "@/components/animations";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { findToolIcon, findToolGroup, TOOL_GROUP_ORDER } from "@/lib/tools/catalogue";
import { ToolsSectionHeader } from "./ToolsSectionHeader";
import { getSectionText } from "@/lib/site.server";
import type { Tool } from "@/types";
import type { ToolsDisplay } from "@/types/settings";

/** Past this many, a still grid starts to look like a wall and scrolls instead. */
const MARQUEE_THRESHOLD = 8;

/**
 * Seconds a strip takes to travel its own length. Fixed per item rather than
 * per strip, so a row of twenty and a row of four move at the same speed —
 * one duration for all of them made the long ones race.
 */
const SECONDS_PER_TOOL = 5;
const MIN_MARQUEE_SECONDS = 24;

/** Entries the catalogue doesn't cover — added by hand — go last, together. */
const OTHER_GROUP = { id: "other", label: "Altro" };

function ToolBadge({ tool }: { tool: Tool }) {
  // A catalogue pick draws its own vector; a manual entry falls back to the
  // logo that was uploaded for it.
  const icon = findToolIcon(tool.slug);
  const label = icon?.title ?? tool.name ?? "";

  const content = (
    <>
      {icon ? (
        <ToolLogo icon={icon} brand className="h-6 w-6" />
      ) : (
        <span className="relative h-6 w-6 shrink-0 overflow-hidden">
          <ImageWithFallback src={tool.image ?? ""} alt="" fill className="object-contain" />
        </span>
      )}
      <span className="text-sm whitespace-nowrap text-foreground">{label}</span>
    </>
  );

  const className =
    "inline-flex items-center gap-2.5 rounded-full border border-border bg-white/[0.03] px-4 py-2.5 transition-colors hover:border-border-strong";

  if (!tool.url) return <span className={className}>{content}</span>;

  return (
    <a href={tool.url} target="_blank" rel="noreferrer noopener" className={className}>
      {content}
    </a>
  );
}

/** Splits the selection by what kind of thing each entry is, in catalogue order. */
function groupTools(tools: Tool[]) {
  const groups = new Map<string, { id: string; label: string; tools: Tool[] }>();

  for (const tool of tools) {
    const group = findToolGroup(tool.slug) ?? OTHER_GROUP;
    const existing = groups.get(group.id);
    if (existing) existing.tools.push(tool);
    else groups.set(group.id, { ...group, tools: [tool] });
  }

  const order = [...TOOL_GROUP_ORDER, OTHER_GROUP.id];
  return [...groups.values()].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

/**
 * The strip of tools, software and languages on the home page, split by kind
 * — languages, frameworks, infrastructure and so on — rather than one long
 * undifferentiated run.
 *
 * Two layouts: still rows, or ones that scroll on their own. The scrolling
 * kind is deliberately inert — nothing to drag, nothing to pause, no buttons
 * — so it reads as motion rather than as something asking to be operated.
 */
export async function ToolsSection({ tools, display }: { tools: Tool[]; display: ToolsDisplay }) {
  const visible = [...tools].sort((a, b) => a.order - b.order);
  if (visible.length === 0) return null;

  const scrolling = display === "marquee" || (display === "auto" && visible.length > MARQUEE_THRESHOLD);
  const heading = await getSectionText("tools");
  const groups = groupTools(visible);

  return (
    <SectionWrapper className="border-t border-border">
      <Container>
        <RevealOnScroll className="text-center">
          <ToolsSectionHeader heading={heading} />
        </RevealOnScroll>

        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <div key={group.id}>
              <p className="mb-4 text-center text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
                {group.label}
              </p>

              {scrolling ? (
                // Faded at both ends so items enter and leave rather than
                // being cut off mid-badge.
                <div
                  className="[--fade:4rem] [mask-image:linear-gradient(to_right,transparent,black_var(--fade),black_calc(100%-var(--fade)),transparent)]"
                  // The strip repeats itself, so screen readers get it once.
                  aria-label={group.tools
                    .map((tool) => findToolIcon(tool.slug)?.title ?? tool.name)
                    .join(", ")}
                >
                  <TextMarquee
                    duration={Math.max(MIN_MARQUEE_SECONDS, group.tools.length * SECONDS_PER_TOOL)}
                  >
                    {group.tools.map((tool) => (
                      <ToolBadge key={tool.id} tool={tool} />
                    ))}
                  </TextMarquee>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  {group.tools.map((tool) => (
                    <ToolBadge key={tool.id} tool={tool} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
