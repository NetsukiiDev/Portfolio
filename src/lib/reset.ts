import { prisma } from "./prisma";
import { deleteStorageFolder } from "./storage";

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
}
