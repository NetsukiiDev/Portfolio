import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import type { StorageDriver, StorageSettings } from "./types";

function createClient(config: StorageSettings["s3"]) {
  return new S3Client({
    region: config.region || "auto",
    endpoint: config.endpoint || undefined,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

function publicUrl(config: StorageSettings["s3"], key: string): string {
  if (config.publicUrlBase) {
    return `${config.publicUrlBase.replace(/\/$/, "")}/${key}`;
  }
  if (config.endpoint) {
    const base = config.endpoint.replace(/\/$/, "");
    return config.forcePathStyle ? `${base}/${config.bucket}/${key}` : `${base}/${key}`;
  }
  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
}

export function createS3Storage(config: StorageSettings["s3"]): StorageDriver {
  const client = createClient(config);

  return {
    async upload(buffer, folder, filename, contentType) {
      const key = `${folder}/${filename}`;
      await client.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );
      return publicUrl(config, key);
    },

    async deleteFolder(folder) {
      const prefix = `${folder}/`;
      let continuationToken: string | undefined;

      do {
        const listed = await client.send(
          new ListObjectsV2Command({ Bucket: config.bucket, Prefix: prefix, ContinuationToken: continuationToken }),
        );
        const objects = (listed.Contents ?? []).map((obj) => ({ Key: obj.Key! })).filter((obj) => obj.Key);
        if (objects.length > 0) {
          await client.send(new DeleteObjectsCommand({ Bucket: config.bucket, Delete: { Objects: objects } }));
        }
        continuationToken = listed.IsTruncated ? listed.NextContinuationToken : undefined;
      } while (continuationToken);
    },
  };
}
