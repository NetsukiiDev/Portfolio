import { prisma } from "./prisma";
import { deleteStorageFolder } from "./storage";
import { runPrismaCommand } from "./db-provision";

export type ResetContentType = "projects" | "blog" | "skills" | "experience" | "ai-gallery";

export const RESET_CONTENT_TYPES: ResetContentType[] = ["projects", "blog", "skills", "experience", "ai-gallery"];

const UPLOAD_FOLDER_BY_TYPE: Record<ResetContentType, string | null> = {
  projects: "projects",
  blog: "blog",
  skills: null,
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
    ["projects", "blog", "ai-gallery", "experience", "settings"].map((folder) => tryDeleteStorageFolder(folder)),
  );

  await prisma.contactMessage.deleteMany({});
  await prisma.aiImage.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.skillCategory.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.settings.deleteMany({});
  await prisma.adminAccount.deleteMany({});

  // Drop and recreate every table from the current schema, not just their
  // rows — a full site reset should leave no trace of the previous schema
  // state either. Data is already cleared above, so this can't lose rows
  // that matter even if it fails partway through.
  //
  // For SQLite, this process's own connection must be closed first: the
  // `prisma db push` subprocess below needs an exclusive lock on the same
  // database file, and execFileSync blocks this process while waiting for
  // it — holding the connection open here would deadlock the two against
  // each other. Prisma reconnects lazily on the next query either way.
  await prisma.$disconnect();
  const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  runPrismaCommand(["db", "push", "--force-reset", "--accept-data-loss"], databaseUrl);
}
