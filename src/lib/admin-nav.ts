import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Briefcase,
  Newspaper,
  Image as ImageIcon,
  Settings,
  Home,
  Blocks,
  Languages,
  type LucideIcon,
} from "lucide-react";

export const ADMIN_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/portfolio", label: "Portfolio", icon: Home },
  { href: "/admin/modules", label: "Moduli", icon: Blocks },
  { href: "/admin/projects", label: "Progetti", icon: FolderKanban },
  { href: "/admin/skills", label: "Competenze", icon: Sparkles },
  { href: "/admin/experience", label: "Esperienza", icon: Briefcase },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/ai-gallery", label: "Galleria AI", icon: ImageIcon },
  { href: "/admin/language", label: "Lingua", icon: Languages },
  { href: "/admin/settings", label: "Impostazioni", icon: Settings },
];
