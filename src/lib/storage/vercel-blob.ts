import { put, list, del } from "@vercel/blob";
import type { StorageDriver, StorageSettings } from "./types";

export function createVercelBlobStorage(config: StorageSettings["vercelBlob"]): StorageDriver {
  const token = config.token || process.env.BLOB_READ_WRITE_TOKEN;

  return {
    async upload(buffer, folder, filename, contentType) {
      const result = await put(`${folder}/${filename}`, buffer, {
        access: "public",
        contentType,
        addRandomSuffix: false,
        token,
      });
      return result.url;
    },

    async deleteFolder(folder) {
      const prefix = `${folder}/`;
      let cursor: string | undefined;

      do {
        const result = await list({ prefix, cursor, token });
        if (result.blobs.length > 0) {
          await del(
            result.blobs.map((blob) => blob.url),
            { token },
          );
        }
        cursor = result.hasMore ? result.cursor : undefined;
      } while (cursor);
    },
  };
}
