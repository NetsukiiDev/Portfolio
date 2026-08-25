import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Briefcase,
  Newspaper,
  Image as ImageIcon,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const ADMIN_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/ai-gallery", label: "AI Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
