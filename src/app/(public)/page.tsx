import { getSettings, getTools, getExperience, getProjects, getSkillsData, getBlogPosts, getAiGallery } from "@/lib/data";
import { DEFAULT_HOME, DEFAULT_TOOLS, DEFAULT_SOCIAL, DEFAULT_PERSONAL } from "@/lib/default-settings";
import { DEFAULT_MODULES } from "@/lib/modules";
import { getGithubStats, parseGithubUsername, type GithubStats } from "@/lib/github";
import { getSectionText, getPageDescriptions } from "@/lib/site.server";
import { socialIcons } from "@/lib/tools/catalogue";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeSection } from "@/components/home/HomeSection";
import { SectionLink } from "@/components/home/SectionLink";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { CallToAction } from "@/components/home/CallToAction";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SkillGrid } from "@/components/skills/SkillGrid";
import { Timeline } from "@/components/experience/Timeline";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { GalleryGrid } from "@/components/ai-gallery/GalleryGrid";
import { ROUTES } from "@/lib/constants";
import type { HomeSettings } from "@/types/settings";
import type { ModulesSettings } from "@/lib/modules";
import type { Settings } from "@/types";

/**
 * The whole site, on one page.
 *
 * Each module that has something to show becomes a band with an anchor the
 * navbar scrolls to. Only the two collections that grow — the blog and the
 * gallery — keep an archive of their own, previewed here and linked to.
 */
export default async function HomePage() {
  let home: HomeSettings = DEFAULT_HOME;
  let modules: ModulesSettings = DEFAULT_MODULES;
  let githubUrl: string | null = null;
  let social: Settings["social"] = DEFAULT_SOCIAL;
  let personal: Settings["personal"] = DEFAULT_PERSONAL;
  let settings: Settings | null = null;
  let toolsDisplay: Settings["tools"]["display"] = DEFAULT_TOOLS.display;

  try {
    settings = await getSettings();
    home = settings.home;
    modules = settings.modules;
    githubUrl = settings.social.github;
    social = settings.social;
    personal = settings.personal;
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

  const [projects, skillsData, experience, posts, gallery] = await Promise.all([
    onHome("projects") ? getProjects() : [],
    onHome("skills") ? getSkillsData() : { categories: [], skills: [] },
    modules.experience.enabled ? getExperience() : [],
    onHome("blog") ? getBlogPosts() : [],
    onHome("aiGallery") ? getAiGallery() : [],
  ]);

  const publishedPosts = posts
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime());

  const viewAll = await getSectionText("viewAll");

  return (
    <>
      <HeroSection
        home={home}
        social={social}
        socialIcons={socialIcons()}
        experience={
          // Newest first, three at most: the hero is a summary, not the CV.
          modules.experience.enabled ? [...experience].sort((a, b) => a.order - b.order).slice(0, 3) : []
        }
      />

      {onHome("projects") && projects.length > 0 && (
        <HomeSection
          id="projects"
          eyebrow="Portfolio"
          heading={await getSectionText("featuredProjects")}
          description={await getPageDescriptions("projects")}
        >
          <ProjectGrid projects={[...projects].sort((a, b) => a.order - b.order)} />
        </HomeSection>
      )}

      {githubStats && <StatsSection stats={home.stats} values={githubStats} />}

      {onHome("tools") && <ToolsSection tools={await getTools()} display={toolsDisplay} />}

      {onHome("skills") && skillsData.skills.length > 0 && (
        <HomeSection
          id="skills"
          eyebrow="Competenze"
          heading={await getSectionText("skills")}
          description={await getPageDescriptions("skills")}
        >
          <SkillGrid categories={skillsData.categories} skills={skillsData.skills} />
        </HomeSection>
      )}

      {onHome("experience") && experience.length > 0 && (
        <HomeSection
          id="experience"
          eyebrow="Percorso"
          heading={await getSectionText("experience")}
          description={await getPageDescriptions("experience")}
        >
          <Timeline items={experience} />
        </HomeSection>
      )}

      {settings && (
        <HomeSection id="about" eyebrow="Profilo" heading={await getSectionText("about")}>
          <AboutSection personal={personal} />
        </HomeSection>
      )}

      {onHome("blog") && publishedPosts.length > 0 && (
        <HomeSection
          id="blog"
          eyebrow="Blog"
          heading={await getSectionText("recentPosts")}
          description={await getPageDescriptions("blog")}
          action={<SectionLink href={ROUTES.blog} label={viewAll} />}
        >
          <BlogGrid posts={publishedPosts.slice(0, 3)} />
        </HomeSection>
      )}

      {onHome("aiGallery") && gallery.length > 0 && (
        <HomeSection
          id="gallery"
          eyebrow="Galleria"
          heading={await getSectionText("gallery")}
          description={await getPageDescriptions("aiGallery")}
          action={<SectionLink href={ROUTES.aiGallery} label={viewAll} />}
        >
          <GalleryGrid images={[...gallery].slice(0, 6)} />
        </HomeSection>
      )}

      {/* The invitation comes before the form it invites you to fill in. */}
      {onHome("contact") && <CallToAction home={home} heading={await getSectionText("ctaHeading")} />}

      {onHome("contact") && settings && (
        <HomeSection
          id="contact"
          eyebrow="Contatti"
          heading={await getSectionText("contact")}
          description={await getPageDescriptions("contact")}
        >
          <ContactSection settings={settings} />
        </HomeSection>
      )}

    </>
  );
}
