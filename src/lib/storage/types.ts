export type StorageProviderKey = "local" | "s3";

export interface StorageSettings {
  provider: StorageProviderKey;
  s3: {
    endpoint: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    forcePathStyle: boolean;
    publicUrlBase: string;
  };
}

export const DEFAULT_STORAGE_SETTINGS: StorageSettings = {
  provider: "local",
  s3: {
    endpoint: "",
    region: "",
    bucket: "",
    accessKeyId: "",
    secretAccessKey: "",
    forcePathStyle: false,
    publicUrlBase: "",
  },
};

export interface StorageDriver {
  upload(buffer: Buffer, folder: string, filename: string, contentType: string): Promise<string>;
  deleteFolder(folder: string): Promise<void>;
}

export const SECRET_MASK = "••••••••";

export function maskStorageSecrets(storage: StorageSettings): StorageSettings {
  return {
    ...storage,
    s3: { ...storage.s3, secretAccessKey: storage.s3.secretAccessKey ? SECRET_MASK : "" },
  };
}
