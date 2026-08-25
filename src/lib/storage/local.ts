import { writeFile, mkdir, rm } from "fs/promises";
import path from "path";
import type { StorageDriver } from "./types";

export const localStorage: StorageDriver = {
  async upload(buffer, folder, filename) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    return `/uploads/${folder}/${filename}`;
  },

  async deleteFolder(folder) {
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await rm(dir, { recursive: true, force: true });
  },
};
