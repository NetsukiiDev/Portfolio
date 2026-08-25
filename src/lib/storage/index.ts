import { getSettings } from "@/lib/data";
import { localStorage } from "./local";
import { createS3Storage } from "./s3";
import type { StorageDriver } from "./types";

async function getDriver(): Promise<StorageDriver> {
  const { storage } = await getSettings();
  switch (storage.provider) {
    case "s3":
      return createS3Storage(storage.s3);
    default:
      return localStorage;
  }
}

export async function uploadFile(
  buffer: Buffer,
  folder: string,
  filename: string,
  contentType: string,
): Promise<string> {
  const driver = await getDriver();
  return driver.upload(buffer, folder, filename, contentType);
}

export async function deleteStorageFolder(folder: string): Promise<void> {
  const driver = await getDriver();
  await driver.deleteFolder(folder);
}
