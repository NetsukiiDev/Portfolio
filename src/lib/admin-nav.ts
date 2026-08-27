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
  Inbox,
  type LucideIcon,
} from "lucide-react";

export interface AdminLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * The sidebar, in three groups: where you land, what you write, and how the
 * site is put together. Flat, the list had grown long enough that "Portfolio"
 * and "Progetti" read as the same kind of thing when they aren't.
 */
export const ADMIN_SECTIONS: { title: string | null; links: AdminLink[] }[] = [
  {
    title: null,
    links: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Contenuti",
    links: [
      { href: "/admin/projects", label: "Progetti", icon: FolderKanban },
      { href: "/admin/skills", label: "Competenze", icon: Sparkles },
      { href: "/admin/experience", label: "Esperienza", icon: Briefcase },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/ai-gallery", label: "Galleria AI", icon: ImageIcon },
      { href: "/admin/messages", label: "Messaggi", icon: Inbox },
    ],
  },
  {
    title: "Sito",
    links: [
      { href: "/admin/portfolio", label: "Portfolio", icon: Home },
      { href: "/admin/modules", label: "Moduli", icon: Blocks },
      { href: "/admin/language", label: "Lingua", icon: Languages },
      { href: "/admin/settings", label: "Impostazioni", icon: Settings },
    ],
  },
];

export const ADMIN_LINKS: AdminLink[] = ADMIN_SECTIONS.flatMap((section) => section.links);
