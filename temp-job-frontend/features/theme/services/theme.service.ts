import { StorageService } from "@/features/storage/services/storage.service";
import backendClient from "@/lib/axios";
import supabase from "@/lib/supabase";
import { BackendResponse } from "@/shared/types/api.type";
import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { Theme } from "../schemas/theme.schema";

const BUCKET_NAME = "theme";

export class ThemeService {
  constructor(
    private readonly backendClient: AxiosInstance,
    private readonly storageService: StorageService
  ) {
    if (!this.storageService) {
      throw new Error("Storage service is not initialized");
    }
  }

  async getAllThemes() {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<Theme[]>>("/themes");

    if (status !== StatusCodes.OK) throw new Error(message);

    return data;
  }

  async uploadThemeImage(themeId: Theme["id"], file: File): Promise<string> {
    try {
      const { path } = await this.storageService.uploadFile(
        file,
        `${themeId}/${file.name}`
      );

      return path;
    } catch (error: any) {
      console.error(`Failed to upload theme image -> ${error.message}`);

      throw new Error("ล้มเหลวระหว่างอัพโหลดรูปภาพธีม");
    }
  }

  async createNewTheme(newTheme: Partial<Theme>): Promise<Theme | null> {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.post<BackendResponse<Theme>>(
      "/themes",
      newTheme
    );

    if (status !== StatusCodes.CREATED) {
      throw new Error(message);
    }

    return data;
  }

  async deleteThemeByThemeId(themeId: Theme["id"]): Promise<void> {
    const {
      status,
      data: { message },
    } = await this.backendClient.delete<BackendResponse<null>>(
      `/themes/${themeId}`
    );

    if (status !== StatusCodes.OK) throw new Error(message);
  }

  async updateTheme(
    themeId: Theme["id"],
    theme: Omit<Partial<Theme>, "id">
  ): Promise<Theme | null> {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.patch<BackendResponse<Theme>>(
      `/themes/${themeId}`,
      theme
    );

    if (status !== StatusCodes.OK) throw new Error(message);

    return data;
  }

  getImagePublicUrl(path: string): string {
    return this.storageService.getFileUrl(path);
  }
}

export const themeService = new ThemeService(
  backendClient,
  new StorageService(BUCKET_NAME, supabase)
);
