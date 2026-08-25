import { rm } from "fs/promises";
import path from "path";
import { prisma } from "./prisma";

export type ResetContentType = "projects" | "blog" | "skills" | "experience" | "ai-gallery";

export const RESET_CONTENT_TYPES: ResetContentType[] = ["projects", "blog", "skills", "experience", "ai-gallery"];

const UPLOAD_FOLDER_BY_TYPE: Record<ResetContentType, string | null> = {
  projects: "projects",
  blog: "blog",
  skills: null,
  experience: "experience",
  "ai-gallery": "ai-gallery",
};

async function clearUploadFolder(folder: string): Promise<void> {
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await rm(dir, { recursive: true, force: true });
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
  if (folder) await clearUploadFolder(folder);
}

export async function resetSite(): Promise<void> {
  await prisma.contactMessage.deleteMany({});
  await prisma.aiImage.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.skillCategory.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.settings.deleteMany({});
  await prisma.adminAccount.deleteMany({});

  await Promise.all(
    ["projects", "blog", "ai-gallery", "experience", "settings"].map((folder) => clearUploadFolder(folder)),
  );
}
