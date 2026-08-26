import { unlink } from "fs/promises";
import path from "path";
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

  // Wipe the schema itself, not just rows — a full site reset should send
  // the setup wizard all the way back to the Database step, not straight to
  // Account. Data is already cleared above, so neither path below can lose
  // rows that matter even if it fails partway through.
  //
  // This process's own connection must be closed first: SQLite needs the
  // file handle released before it can be deleted, and the `prisma db push`
  // subprocess for MySQL needs an exclusive lock that this same process
  // would otherwise be holding (execFileSync blocks the event loop while
  // waiting on the subprocess — holding the connection open here would
  // deadlock the two against each other). Prisma reconnects lazily on the
  // next query either way.
  await prisma.$disconnect();
  const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

  if (databaseUrl.startsWith("mysql://")) {
    // No filesystem-level "database" to delete on a network server — drop
    // and recreate every table instead, leaving an empty but present schema.
    runPrismaCommand(["db", "push", "--force-reset", "--accept-data-loss"], databaseUrl);
  } else {
    // Delete the database file outright: the next connection attempt then
    // hits a missing table (not just an empty one), which is what actually
    // sends getSetupStatus() back to "database" instead of "account".
    const filePath = path.resolve(process.cwd(), databaseUrl.replace(/^file:/, ""));
    await unlink(filePath).catch(() => {});
  }
}
