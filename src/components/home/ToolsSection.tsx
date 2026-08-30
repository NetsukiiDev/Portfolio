import { Container } from "@/components/layout/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RevealOnScroll, TextMarquee } from "@/components/animations";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ToolsSectionHeader } from "./ToolsSectionHeader";
import { getSectionText } from "@/lib/site.server";
import type { Tool } from "@/types";
import type { ToolsDisplay } from "@/types/settings";

/** Past this many, a still grid starts to look like a wall and scrolls instead. */
const MARQUEE_THRESHOLD = 8;

function ToolBadge({ tool }: { tool: Tool }) {
  const content = (
    <>
      <span className="relative h-7 w-7 shrink-0 overflow-hidden">
        <ImageWithFallback src={tool.image} alt="" fill className="object-contain" />
      </span>
      <span className="text-sm whitespace-nowrap text-foreground">{tool.name}</span>
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

/**
 * The strip of tools, software and languages on the home page.
 *
 * Two layouts: a still grid, or a marquee that scrolls on its own. The
 * marquee is deliberately inert — no dragging, no pausing, no buttons — so
 * it reads as motion rather than as something asking to be operated.
 */
export async function ToolsSection({ tools, display }: { tools: Tool[]; display: ToolsDisplay }) {
  const visible = tools.filter((tool) => tool.visible).sort((a, b) => a.order - b.order);
  if (visible.length === 0) return null;

  const scrolling = display === "marquee" || (display === "auto" && visible.length > MARQUEE_THRESHOLD);
  const heading = await getSectionText("tools");

  return (
    <SectionWrapper className="border-t border-border">
      <Container>
        <RevealOnScroll className="text-center">
          <ToolsSectionHeader heading={heading} />
        </RevealOnScroll>

        <div className="mt-8">
          {scrolling ? (
            // Faded at both ends so items enter and leave rather than being
            // cut off mid-badge.
            <div
              className="[--fade:4rem] [mask-image:linear-gradient(to_right,transparent,black_var(--fade),black_calc(100%-var(--fade)),transparent)]"
              // The strip repeats itself, so screen readers get it once.
              aria-label={visible.map((tool) => tool.name).join(", ")}
            >
              <TextMarquee>
                {visible.map((tool) => (
                  <ToolBadge key={tool.id} tool={tool} />
                ))}
              </TextMarquee>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {visible.map((tool, index) => (
                <RevealOnScroll key={tool.id} delay={index * 0.03}>
                  <ToolBadge tool={tool} />
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </Container>
    </SectionWrapper>
  );
}
