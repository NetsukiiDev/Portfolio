import * as simpleIcons from "simple-icons";

/**
 * The built-in catalogue of tools, software and languages. The admin picks
 * from this rather than uploading anything: logos come from Simple Icons, so
 * they're the real marks, drawn as vectors, with no files to manage and no
 * request leaving the server.
 *
 * Simple Icons removes an icon when a brand asks it to — Java, AWS, Azure,
 * VS Code, Adobe and Slack have all gone that way — so slugs are resolved at
 * runtime and anything that has disappeared is simply skipped rather than
 * breaking the build. Whatever the catalogue can't cover is what the custom
 * entry in the admin is for.
 */
export interface ToolIcon {
  slug: string;
  title: string;
  /** Brand colour, without the leading #. */
  hex: string;
  /** SVG path data, drawn in a 24×24 viewBox. */
  path: string;
}

export interface ToolGroup {
  id: string;
  label: string;
  icons: ToolIcon[];
}

const bySlug = new Map<string, ToolIcon>();
for (const value of Object.values(simpleIcons)) {
  const icon = value as Partial<ToolIcon>;
  if (icon && typeof icon === "object" && icon.slug && icon.path && icon.title && icon.hex) {
    bySlug.set(icon.slug, { slug: icon.slug, title: icon.title, hex: icon.hex, path: icon.path });
  }
}

const GROUPS: { id: string; label: string; slugs: string[] }[] = [
  {
    id: "languages",
    label: "Linguaggi",
    slugs: [
      "typescript", "javascript", "python", "php", "rust", "go", "cplusplus", "c", "kotlin",
      "swift", "ruby", "dart", "lua", "r", "scala", "elixir", "haskell", "perl", "html5", "css",
      "sass", "markdown", "gnubash",
    ],
  },
  {
    id: "frameworks",
    label: "Framework e librerie",
    slugs: [
      "react", "nextdotjs", "vuedotjs", "nuxt", "svelte", "angular", "astro", "remix", "solid",
      "qwik", "express", "nestjs", "fastify", "django", "flask", "fastapi", "laravel", "symfony",
      "spring", "dotnet", "rubyonrails", "tailwindcss", "bootstrap", "jquery", "threedotjs",
      "electron", "flutter", "tauri",
    ],
  },
  {
    id: "databases",
    label: "Database",
    slugs: [
      "postgresql", "mysql", "mariadb", "sqlite", "mongodb", "redis", "prisma", "supabase",
      "firebase", "planetscale", "elasticsearch", "influxdb", "neo4j",
    ],
  },
  {
    id: "infra",
    label: "Infrastruttura e cloud",
    slugs: [
      "docker", "kubernetes", "nginx", "apache", "linux", "ubuntu", "debian", "archlinux",
      "alpinelinux", "proxmox", "terraform", "ansible", "githubactions", "gitlab", "jenkins",
      "cloudflare", "googlecloud", "digitalocean", "vercel", "netlify", "portainer",
      "traefikproxy", "grafana", "prometheus", "openwrt",
    ],
  },
  {
    id: "tools",
    label: "Strumenti",
    slugs: [
      "git", "github", "bitbucket", "jetbrains", "intellijidea", "webstorm", "phpstorm", "neovim",
      "vim", "figma", "blender", "postman", "insomnia", "notion", "obsidian", "discord", "jira",
      "trello", "linear", "npm", "pnpm", "yarn", "bun", "deno", "nodedotjs", "vite", "webpack",
      "esbuild", "eslint", "prettier", "jest", "vitest", "cypress", "storybook", "graphql",
      "apollographql", "socketdotio", "stripe", "tensorflow", "pytorch", "wordpress", "shopify",
      "raspberrypi", "arduino", "unity", "unrealengine", "godotengine",
    ],
  },
];

export const TOOL_CATALOGUE: ToolGroup[] = GROUPS.map((group) => ({
  id: group.id,
  label: group.label,
  icons: group.slugs
    .map((slug) => bySlug.get(slug))
    .filter((icon): icon is ToolIcon => icon !== undefined),
}));

/** Every catalogue entry, flattened — for resolving what's been selected. */
export const TOOL_ICONS: Map<string, ToolIcon> = new Map(
  TOOL_CATALOGUE.flatMap((group) => group.icons).map((icon) => [icon.slug, icon]),
);

export function findToolIcon(slug: string | null): ToolIcon | null {
  return slug ? (TOOL_ICONS.get(slug) ?? bySlug.get(slug) ?? null) : null;
}
