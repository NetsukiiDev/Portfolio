import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { SkillsPreview } from "@/components/home/SkillsPreview";
import { StatsSection } from "@/components/home/StatsSection";
import { RecentBlog } from "@/components/home/RecentBlog";
import { CallToAction } from "@/components/home/CallToAction";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProjects />
      <SkillsPreview />
      <StatsSection />
      <RecentBlog />
      <CallToAction />
    </>
  );
}
