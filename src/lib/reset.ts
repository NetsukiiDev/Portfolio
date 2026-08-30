import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "./prisma";
import { deleteStorageFolder } from "./storage";

// Matches the model names in prisma/schema.*.prisma — there's no @@map, so
// table names are identical to these.
const ALL_TABLES = [
  "AdminAccount",
  "AiImage",
  "BlogPost",
  "ContactMessage",
  "Experience",
  "Project",
  "Settings",
  "Skill",
  "SkillCategory",
  "Tool",
];

export type ResetContentType = "projects" | "blog" | "skills" | "tools" | "experience" | "ai-gallery";

export const RESET_CONTENT_TYPES: ResetContentType[] = [
  "projects",
  "blog",
  "skills",
  "tools",
  "experience",
  "ai-gallery",
];

const UPLOAD_FOLDER_BY_TYPE: Record<ResetContentType, string | null> = {
  projects: "projects",
  blog: "blog",
  skills: null,
  tools: "tools",
  experience: "experience",
  "ai-gallery": "ai-gallery",
};

// Best-effort: a misconfigured/unreachable external storage provider shouldn't
// block clearing the database rows the admin actually asked to reset.
async function tryDeleteStorageFolder(folder: string): Promise<void> {
  try {
    await deleteStorageFolder(folder);
  } catch (error) {
    console.error(`Failed to delete storage folder "${folder}":`, error);
  }
}

export async function resetContent(type: ResetContentType): Promise<void> {
  switch (type) {
    case "projects":
      await prisma.project.deleteMany({});
      break;
    case "blog":
      await prisma.blogPost.deleteMany({});
      break;
    case "skills":
      await prisma.skill.deleteMany({});
      await prisma.skillCategory.deleteMany({});
      break;
    case "tools":
      await prisma.tool.deleteMany({});
      break;
    case "experience":
      await prisma.experience.deleteMany({});
      break;
    case "ai-gallery":
      await prisma.aiImage.deleteMany({});
      break;
  }

  const folder = UPLOAD_FOLDER_BY_TYPE[type];
  if (folder) await tryDeleteStorageFolder(folder);
}

export async function resetSite(): Promise<void> {
  // Clear uploaded files first — deleteStorageFolder needs the Settings row
  // (for the active storage provider) to still exist to read its config.
  await Promise.all(
    ["projects", "blog", "ai-gallery", "experience", "tools", "settings"].map((folder) =>
      tryDeleteStorageFolder(folder),
    ),
  );

  await prisma.contactMessage.deleteMany({});
  await prisma.aiImage.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.tool.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.skillCategory.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.settings.deleteMany({});
  await prisma.adminAccount.deleteMany({});

  // Wipe the schema itself, not just rows — a full site reset should send
  // the setup wizard all the way back to the Database step, not straight to
  // Account. Data is already cleared above, so neither path below can lose
  // rows that matter even if it fails partway through.
  //
  // Recreating empty tables (e.g. via `prisma db push --force-reset`) isn't
  // enough: AdminAccount would still exist and be queryable, just empty, and
  // getSetupStatus() reads that as "past the database step" — it only treats
  // a query as "not set up" when it actually throws (missing table). So both
  // paths below remove the tables outright instead of recreating them.
  const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

  if (databaseUrl.startsWith("mysql://")) {
    // Drop every table directly over the existing connection — no schema to
    // push back, so no separate CLI process (and no lock contention with it).
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of ALL_TABLES) {
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS \`${table}\``);
    }
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1");
  } else {
    // Delete the database file outright. This process's own connection must
    // be closed first so the file handle is released before unlink — Prisma
    // reconnects lazily on the next query, creating a fresh (tableless) file.
    await prisma.$disconnect();
    const filePath = path.resolve(process.cwd(), databaseUrl.replace(/^file:/, ""));
    await unlink(filePath).catch(() => {});
  }
}
