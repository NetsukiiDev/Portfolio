import Link from "next/link";
import {
  getProjects,
  getBlogPosts,
  getExperience,
  getAiGallery,
  getSkillsData,
  getTools,
  getContactMessages,
} from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboardPage() {
  const [projects, posts, experience, gallery, skillsData, tools, messages] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getExperience(),
    getAiGallery(),
    getSkillsData(),
    getTools(),
    getContactMessages(),
  ]);

  const stats = [
    { label: "Progetti", value: projects.length, href: "/admin/projects" },
    { label: "Competenze", value: skillsData.skills.length, href: "/admin/skills" },
    { label: "Strumenti e software", value: tools.length, href: "/admin/tools" },
    { label: "Voci di esperienza", value: experience.length, href: "/admin/experience" },
    { label: "Articoli del blog", value: posts.length, href: "/admin/blog" },
    { label: "Immagini della galleria", value: gallery.length, href: "/admin/ai-gallery" },
    { label: "Messaggi ricevuti", value: messages.length, href: "/admin/messages" },
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
