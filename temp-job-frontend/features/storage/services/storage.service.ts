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

  async listAllFilesWithPaths(path: string): Promise<string[]> {
    const { data: fileNames, error } = await this.supabaseClient.storage
      .from(this.bucketName)
      .list(path);

    if (error) throw error;

    return fileNames.map((file) => `${path}/${file.name}`);
  }

  async deleteFiles(paths: string[]) {
    const { error } = await this.supabaseClient.storage
      .from(this.bucketName)
      .remove(paths);

    if (error) throw error;
  }
}
