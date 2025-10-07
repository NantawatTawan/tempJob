import { SupabaseClient } from "@supabase/supabase-js";

export class StorageService {
  constructor(
    private readonly bucketName: string,
    private readonly supabaseClient: SupabaseClient
  ) {
    if (!this.bucketName) throw new Error("Bucket name is required");
    if (!this.supabaseClient) throw new Error("Supabase client is required");
  }

  async uploadFile(file: File, path: string) {
    const { data, error } = await this.supabaseClient.storage
      .from(this.bucketName)
      .upload(path, file, {
        upsert: true,
      });

    if (error) throw error;

    return data;
  }

  getFileUrl(path: string) {
    const { data } = this.supabaseClient.storage
      .from(this.bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async listAllFiles(path: string): Promise<string[]> {
    const { data: fileNames, error } = await this.supabaseClient.storage
      .from(this.bucketName)
      .list(path);

    if (error) throw error;

    return fileNames.map((file) => file.name);
  }

  async deleteAllFilesInFolder(folderPath: string): Promise<void> {
    const fileNames = await this.listAllFiles(folderPath);

    const { error } = await this.supabaseClient.storage
      .from(this.bucketName)
      .remove(fileNames.map((file) => `${folderPath}/${file}`));

    if (error) throw new Error(error.message);
  }
}

export class StorageServiceFactory {
  static createStorageService(
    bucketName: string,
    supabaseClient: SupabaseClient
  ): StorageService {
    return new StorageService(bucketName, supabaseClient);
  }
}
