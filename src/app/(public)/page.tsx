import { getSettings, getTools } from "@/lib/data";
import { getSectionText } from "@/lib/site.server";
import { DEFAULT_HOME, DEFAULT_TOOLS } from "@/lib/default-settings";
import { DEFAULT_MODULES } from "@/lib/modules";
import { getGithubStats, parseGithubUsername, type GithubStats } from "@/lib/github";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ToolsSection } from "@/components/home/ToolsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { RecentBlog } from "@/components/home/RecentBlog";
import { CallToAction } from "@/components/home/CallToAction";
import type { HomeSettings } from "@/types/settings";
import type { Settings } from "@/types";
import type { ModulesSettings } from "@/lib/modules";

export default async function HomePage() {
  let home: HomeSettings = DEFAULT_HOME;
  let modules: ModulesSettings = DEFAULT_MODULES;
  let githubUrl: string | null = null;
  let toolsDisplay: Settings["tools"]["display"] = DEFAULT_TOOLS.display;

  try {
    const settings = await getSettings();
    home = settings.home;
    modules = settings.modules;
    githubUrl = settings.social.github;
    toolsDisplay = settings.tools.display;
  } catch {
    // Settings row doesn't exist yet (pre-setup) — fall back to defaults.
  }

  // No GitHub profile configured, or GitHub unreachable: drop the section
  // rather than showing zeros that read as real figures.
  const githubStats: GithubStats | null = home.statsEnabled
    ? await getGithubStats(parseGithubUsername(githubUrl))
    : null;

  // A section shows only when its module is on *and* it's set to appear here.
  const onHome = (key: keyof ModulesSettings) => modules[key].enabled && modules[key].showOnHome;

  return (
    <>
      <HeroSection home={home} />
      {onHome("projects") && <FeaturedProjects />}
      {onHome("tools") && <ToolsSection tools={await getTools()} display={toolsDisplay} />}
      {githubStats && <StatsSection stats={home.stats} values={githubStats} />}
      {onHome("blog") && <RecentBlog />}
      {onHome("contact") && <CallToAction home={home} heading={await getSectionText("ctaHeading")} />}
    </>
  );
}
