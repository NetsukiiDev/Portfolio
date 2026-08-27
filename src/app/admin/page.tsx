import Link from "next/link";
import { getProjects, getBlogPosts, getExperience, getAiGallery, getSkillsData } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboardPage() {
  const [projects, posts, experience, gallery, skillsData] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getExperience(),
    getAiGallery(),
    getSkillsData(),
  ]);

  const stats = [
    { label: "Projects", value: projects.length, href: "/admin/projects" },
    { label: "Blog posts", value: posts.length, href: "/admin/blog" },
    { label: "Experience entries", value: experience.length, href: "/admin/experience" },
    { label: "AI gallery images", value: gallery.length, href: "/admin/ai-gallery" },
    { label: "Skills", value: skillsData.skills.length, href: "/admin/skills" },
  ];

  return (
    <div>
      <AdminHeader title="Dashboard" description="Panoramica dei contenuti del sito." />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-6 transition-colors hover:border-border-strong">
              <p className="text-3xl font-medium tracking-tight text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
