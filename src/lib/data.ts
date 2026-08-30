import { cache } from "react";
import { prisma } from "./prisma";
import { isPaletteKey, isThemeMode } from "./theme";
import { DEFAULT_STORAGE_SETTINGS } from "./storage/types";
import { mergeTunnelSettings } from "./tunnel/types";
import { mergeModules } from "./modules";
import { fillTranslations } from "./translate";
import { LOCALES } from "./constants";
import { DEFAULT_HOME, DEFAULT_LANGUAGE, DEFAULT_PAGES } from "./default-settings";
import type { StorageSettings } from "./storage/types";
import type { Prisma } from "@/generated/prisma-sqlite/client";
import type {
  Project,
  ProjectCategory,
  ProjectTranslation,
  Locale,
  BlogPost,
  BlogStatus,
  BlogTranslation,
  SkillCategory,
  Skill,
  SkillsData,
  Experience,
  ExperienceType,
  ExperienceTranslation,
  AiImage,
  AiImageTranslation,
  AiLora,
  Settings,
} from "@/types";

// Prisma's Json input type requires an index signature our plain data interfaces
// don't have; this just documents that the cast is intentional (values are always
// plain JSON-serializable data written by this module).
function toJson<T>(value: T): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

// Every admin-authored model stores its text as `translations[locale]`, and
// the admin only writes the language configured under Admin → Lingua. Filling
// the rest here means each write path gets it, rather than every form and API
// route having to remember. Existing text is never overwritten, so a
// translation corrected by hand survives later saves.
async function withTranslations<T>(translations: T, previous?: unknown): Promise<T> {
  try {
    const { language } = await getSettings();
    const targets = LOCALES.filter((locale) => locale !== language.defaultLocale);
    const filled = await fillTranslations(
      translations as Record<string, Record<string, unknown>>,
      language.defaultLocale,
      targets,
      { previous: (previous ?? null) as Record<string, Record<string, unknown>> | null },
    );
    return filled as T;
  } catch {
    // Settings unreadable (pre-setup) — store exactly what was given.
    return translations;
  }
}

// What's stored for a row right now, so withTranslations can tell which
// source fields the admin actually changed and refresh only those.
async function priorTranslations(
  load: () => Promise<{ translations: unknown } | null>,
): Promise<unknown> {
  try {
    return (await load())?.translations ?? null;
  } catch {
    return null;
  }
}

// ---------- Projects ----------

function mapProject(row: {
  id: string;
  slug: string;
  featured: boolean;
  order: number;
  category: string;
  images: unknown;
  links: unknown;
  techStack: unknown;
  translations: unknown;
  createdAt: Date;
  updatedAt: Date;
}): Project {
  return {
    id: row.id,
    slug: row.slug,
    featured: row.featured,
    order: row.order,
    category: row.category as ProjectCategory,
    images: row.images as string[],
    links: row.links as { demo?: string; github?: string },
    techStack: row.techStack as string[],
    translations: row.translations as Record<Locale, ProjectTranslation>,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany();
  return rows.map(mapProject);
}

export async function createProject(project: Project): Promise<Project> {
  const row = await prisma.project.create({
    data: {
      id: project.id,
      slug: project.slug,
      featured: project.featured,
      order: project.order,
      category: project.category,
      images: toJson(project.images),
      links: toJson(project.links),
      techStack: toJson(project.techStack),
      translations: toJson(await withTranslations(project.translations)),
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    },
  });
  return mapProject(row);
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  try {
    const row = await prisma.project.update({
      where: { id },
      data: {
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.images !== undefined && { images: toJson(data.images) }),
        ...(data.links !== undefined && { links: toJson(data.links) }),
        ...(data.techStack !== undefined && { techStack: toJson(data.techStack) }),
        ...(data.translations !== undefined && {
          translations: toJson(
            await withTranslations(
              data.translations,
              await priorTranslations(() =>
                prisma.project.findUnique({ where: { id }, select: { translations: true } }),
              ),
            ),
          ),
        }),
        updatedAt: new Date(),
      },
    });
    return mapProject(row);
  } catch {
    return null;
  }
}

export async function deleteProject(id: string): Promise<void> {
  await prisma.project.deleteMany({ where: { id } });
}

// ---------- Blog ----------

function mapBlogPost(row: {
  id: string;
  slug: string;
  status: string;
  coverImage: string;
  tags: unknown;
  readingTime: number;
  translations: unknown;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status as BlogStatus,
    coverImage: row.coverImage,
    tags: row.tags as string[],
    readingTime: row.readingTime,
    translations: row.translations as Record<Locale, BlogTranslation>,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany();
  return rows.map(mapBlogPost);
}

export async function createBlogPost(post: BlogPost): Promise<BlogPost> {
  const row = await prisma.blogPost.create({
    data: {
      id: post.id,
      slug: post.slug,
      status: post.status,
      coverImage: post.coverImage,
      tags: toJson(post.tags),
      readingTime: post.readingTime,
      translations: toJson(await withTranslations(post.translations)),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    },
  });
  return mapBlogPost(row);
}

export async function updateBlogPostBySlug(slug: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const row = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(data.tags !== undefined && { tags: toJson(data.tags) }),
        ...(data.readingTime !== undefined && { readingTime: data.readingTime }),
        ...(data.translations !== undefined && {
          translations: toJson(
            await withTranslations(
              data.translations,
              await priorTranslations(() =>
                prisma.blogPost.findUnique({ where: { slug }, select: { translations: true } }),
              ),
            ),
          ),
        }),
        ...(data.publishedAt !== undefined && {
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        }),
        updatedAt: new Date(),
      },
    });
    return mapBlogPost(row);
  } catch {
    return null;
  }
}

export async function deleteBlogPostBySlug(slug: string): Promise<void> {
  await prisma.blogPost.deleteMany({ where: { slug } });
}

// ---------- Skills ----------

function mapSkillCategory(row: { id: string; order: number; translations: unknown }): SkillCategory {
  return {
    id: row.id,
    order: row.order,
    translations: row.translations as Record<Locale, { name: string }>,
  };
}

function mapSkill(row: {
  id: string;
  categoryId: string;
  icon: string;
  proficiency: number;
  yearsOfExperience: number;
  order: number;
  translations: unknown;
}): Skill {
  return {
    id: row.id,
    categoryId: row.categoryId,
    icon: row.icon,
    proficiency: row.proficiency,
    yearsOfExperience: row.yearsOfExperience,
    order: row.order,
    translations: row.translations as Record<Locale, { name: string; description: string }>,
  };
}

export async function getSkillsData(): Promise<SkillsData> {
  const [categories, skills] = await Promise.all([
    prisma.skillCategory.findMany(),
    prisma.skill.findMany(),
  ]);
  return { categories: categories.map(mapSkillCategory), skills: skills.map(mapSkill) };
}

export async function createSkill(skill: Skill): Promise<Skill> {
  const row = await prisma.skill.create({
    data: {
      id: skill.id,
      categoryId: skill.categoryId,
      icon: skill.icon,
      proficiency: skill.proficiency,
      yearsOfExperience: skill.yearsOfExperience,
      order: skill.order,
      translations: toJson(await withTranslations(skill.translations)),
    },
  });
  return mapSkill(row);
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<Skill | null> {
  try {
    const row = await prisma.skill.update({
      where: { id },
      data: {
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.proficiency !== undefined && { proficiency: data.proficiency }),
        ...(data.yearsOfExperience !== undefined && { yearsOfExperience: data.yearsOfExperience }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.translations !== undefined && {
          translations: toJson(
            await withTranslations(
              data.translations,
              await priorTranslations(() =>
                prisma.skill.findUnique({ where: { id }, select: { translations: true } }),
              ),
            ),
          ),
        }),
      },
    });
    return mapSkill(row);
  } catch {
    return null;
  }
}

export async function deleteSkill(id: string): Promise<void> {
  await prisma.skill.deleteMany({ where: { id } });
}

// ---------- Experience ----------

function mapExperience(row: {
  id: string;
  type: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
  company: string;
  logo: string;
  website: string | null;
  translations: unknown;
}): Experience {
  return {
    id: row.id,
    type: row.type as ExperienceType,
    startDate: row.startDate,
    endDate: row.endDate,
    current: row.current,
    order: row.order,
    company: row.company,
    logo: row.logo,
    website: row.website ?? undefined,
    translations: row.translations as Record<Locale, ExperienceTranslation>,
  };
}

export async function getExperience(): Promise<Experience[]> {
  const rows = await prisma.experience.findMany();
  return rows.map(mapExperience);
}

export async function createExperience(entry: Experience): Promise<Experience> {
  const row = await prisma.experience.create({
    data: {
      id: entry.id,
      type: entry.type,
      startDate: entry.startDate,
      endDate: entry.endDate,
      current: entry.current,
      order: entry.order,
      company: entry.company,
      logo: entry.logo,
      website: entry.website,
      translations: toJson(await withTranslations(entry.translations)),
    },
  });
  return mapExperience(row);
}

export async function updateExperience(id: string, data: Partial<Experience>): Promise<Experience | null> {
  try {
    const row = await prisma.experience.update({
      where: { id },
      data: {
        ...(data.type !== undefined && { type: data.type }),
        ...(data.startDate !== undefined && { startDate: data.startDate }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
        ...(data.current !== undefined && { current: data.current }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.logo !== undefined && { logo: data.logo }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.translations !== undefined && {
          translations: toJson(
            await withTranslations(
              data.translations,
              await priorTranslations(() =>
                prisma.experience.findUnique({ where: { id }, select: { translations: true } }),
              ),
            ),
          ),
        }),
      },
    });
    return mapExperience(row);
  } catch {
    return null;
  }
}

export async function deleteExperience(id: string): Promise<void> {
  await prisma.experience.deleteMany({ where: { id } });
}

// ---------- AI Gallery ----------

function mapAiImage(row: {
  id: string;
  image: string;
  thumbnail: string;
  tags: unknown;
  model: string;
  sampler: string;
  steps: number;
  cfgScale: number;
  seed: number;
  negativePrompt: string;
  loras: unknown;
  translations: unknown;
  createdAt: Date;
}): AiImage {
  return {
    id: row.id,
    image: row.image,
    thumbnail: row.thumbnail,
    tags: row.tags as string[],
    model: row.model,
    sampler: row.sampler,
    steps: row.steps,
    cfgScale: row.cfgScale,
    seed: row.seed,
    negativePrompt: row.negativePrompt,
    loras: row.loras as AiLora[],
    translations: row.translations as Record<Locale, AiImageTranslation>,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getAiGallery(): Promise<AiImage[]> {
  const rows = await prisma.aiImage.findMany();
  return rows.map(mapAiImage);
}

export async function createAiImage(image: AiImage): Promise<AiImage> {
  const row = await prisma.aiImage.create({
    data: {
      id: image.id,
      image: image.image,
      thumbnail: image.thumbnail,
      tags: toJson(image.tags),
      model: image.model,
      sampler: image.sampler,
      steps: image.steps,
      cfgScale: image.cfgScale,
      seed: image.seed,
      negativePrompt: image.negativePrompt,
      loras: toJson(image.loras),
      translations: toJson(await withTranslations(image.translations)),
      createdAt: new Date(image.createdAt),
    },
  });
  return mapAiImage(row);
}

export async function updateAiImage(id: string, data: Partial<AiImage>): Promise<AiImage | null> {
  try {
    const row = await prisma.aiImage.update({
      where: { id },
      data: {
        ...(data.image !== undefined && { image: data.image }),
        ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
        ...(data.tags !== undefined && { tags: toJson(data.tags) }),
        ...(data.model !== undefined && { model: data.model }),
        ...(data.sampler !== undefined && { sampler: data.sampler }),
        ...(data.steps !== undefined && { steps: data.steps }),
        ...(data.cfgScale !== undefined && { cfgScale: data.cfgScale }),
        ...(data.seed !== undefined && { seed: data.seed }),
        ...(data.negativePrompt !== undefined && { negativePrompt: data.negativePrompt }),
        ...(data.loras !== undefined && { loras: toJson(data.loras) }),
        ...(data.translations !== undefined && {
          translations: toJson(
            await withTranslations(
              data.translations,
              await priorTranslations(() =>
                prisma.aiImage.findUnique({ where: { id }, select: { translations: true } }),
              ),
            ),
          ),
        }),
      },
    });
    return mapAiImage(row);
  } catch {
    return null;
  }
}

export async function deleteAiImage(id: string): Promise<void> {
  await prisma.aiImage.deleteMany({ where: { id } });
}

// ---------- Settings (singleton) ----------

const SETTINGS_ID = "singleton";

function mergeStorageSettings(stored: unknown): StorageSettings {
  const value = (stored ?? {}) as Partial<StorageSettings>;
  return {
    ...DEFAULT_STORAGE_SETTINGS,
    ...value,
    s3: { ...DEFAULT_STORAGE_SETTINGS.s3, ...value.s3 },
  };
}

function mergeLanguage(stored: unknown, storedDefault: Locale): Settings["language"] {
  const value = (stored ?? {}) as Partial<Settings["language"]>;
  // defaultLocale keeps living in its own column (the setup wizard writes it
  // before this blob exists), so the column stays the source of truth for it.
  return { ...DEFAULT_LANGUAGE, ...value, defaultLocale: storedDefault };
}

function mergeHome(stored: unknown): Settings["home"] {
  const value = (stored ?? {}) as Partial<Settings["home"]>;
  // Stats used to hold hand-entered numbers; anything without a GitHub key
  // predates that change and is replaced wholesale rather than half-migrated.
  const stats = value.stats?.every((stat) => stat && "key" in stat) ? value.stats : DEFAULT_HOME.stats;
  return { ...DEFAULT_HOME, ...value, stats } as Settings["home"];
}

function mergePages(stored: unknown): Settings["pages"] {
  const value = (stored ?? {}) as Partial<Settings["pages"]>;
  // Per-locale merge, so a page added to PAGE_KEYS later still has copy.
  return {
    translations: {
      en: { ...DEFAULT_PAGES.translations.en, ...value.translations?.en },
      it: { ...DEFAULT_PAGES.translations.it, ...value.translations?.it },
    },
  };
}

export const getSettings = cache(async (): Promise<Settings> => {
  const row = await prisma.settings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
  return {
    language: mergeLanguage(row.language, row.defaultLocale as Locale),
    site: {
      domain: row.domain,
      https: row.https,
      themePalette: isPaletteKey(row.themePalette) ? row.themePalette : "violet",
      themeMode: isThemeMode(row.themeMode) ? row.themeMode : "dark",
    },
    storage: mergeStorageSettings(row.storage),
    tunnel: mergeTunnelSettings(row.tunnel),
    personal: row.personal as Settings["personal"],
    social: row.social as Settings["social"],
    seo: row.seo as Settings["seo"],
    contactForm: row.contactForm as Settings["contactForm"],
    maintenance: row.maintenance as Settings["maintenance"],
    modules: mergeModules(row.modules),
    home: mergeHome(row.home),
    pages: mergePages(row.pages),
  };
});

export async function saveSettings(data: Settings): Promise<void> {
  // The settings-level texts get the same treatment as content: the admin
  // writes one language, the others are generated. Without this only the
  // manual button under Admin → Lingua ever filled them, so a profile or a
  // hero written in Italian stayed blank for English visitors.
  const previous = await getSettings().catch(() => null);
  const personal = {
    ...data.personal,
    translations: await withTranslations(data.personal.translations, previous?.personal.translations),
  };
  const seo = { ...data.seo, translations: await withTranslations(data.seo.translations, previous?.seo.translations) };
  const maintenance = {
    ...data.maintenance,
    translations: await withTranslations(data.maintenance.translations, previous?.maintenance.translations),
  };
  const pages = {
    ...data.pages,
    translations: await withTranslations(data.pages.translations, previous?.pages.translations),
  };
  const home = {
    ...data.home,
    translations: await withTranslations(data.home.translations, previous?.home.translations),
    stats: await Promise.all(
      data.home.stats.map(async (stat) => ({
        ...stat,
        translations: await withTranslations(
          stat.translations,
          previous?.home.stats.find((prior) => prior.key === stat.key)?.translations,
        ),
      })),
    ),
  };

  await prisma.settings.update({
    where: { id: SETTINGS_ID },
    data: {
      defaultLocale: data.language.defaultLocale,
      language: toJson(data.language),
      domain: data.site.domain,
      https: data.site.https,
      themePalette: data.site.themePalette,
      themeMode: data.site.themeMode,
      storage: toJson(data.storage),
      tunnel: toJson(data.tunnel),
      personal: toJson(personal),
      social: toJson(data.social),
      seo: toJson({
        ...seo,
        siteUrl: data.site.domain ? `${data.site.https ? "https" : "http"}://${data.site.domain}` : data.seo.siteUrl,
      }),
      contactForm: toJson(data.contactForm),
      maintenance: toJson(maintenance),
      modules: toJson(data.modules),
      home: toJson(home),
      pages: toJson(pages),
    },
  });
}

// ---------- Contact messages ----------

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

/** Newest first — the admin reads these under Admin → Messaggi. */
export async function getContactMessages(): Promise<ContactMessage[]> {
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function deleteContactMessage(id: string): Promise<void> {
  await prisma.contactMessage.deleteMany({ where: { id } });
}

export async function createContactMessage(message: {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}): Promise<void> {
  await prisma.contactMessage.create({
    data: {
      id: message.id,
      name: message.name,
      email: message.email,
      message: message.message,
      createdAt: new Date(message.createdAt),
    },
  });
}
