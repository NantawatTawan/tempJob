import { StorageService } from "@/features/storage/services/storage.service";
import backendClient from "@/lib/axios";
import supabase from "@/lib/supabase";
import { BackendResponse } from "@/shared/types/api.type";
import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { Advertisement } from "../schemas/advertisement.schema";

export class AdvertisementService {
  constructor(
    private readonly backendClient: AxiosInstance,
    private readonly storageService: StorageService
  ) {
    if (!backendClient) {
      throw new Error("Backend client is not initialized");
    }
    if (!storageService) {
      throw new Error("Storage service is not initialized");
    }
  }

  async getAllAdvertisements() {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<Advertisement[]>>(
      "/advertisements"
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }

  async getAdvertisementById(advertisementId: Advertisement["id"]) {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<Advertisement>>(
      `/advertisements/${advertisementId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }

  async createAdvertisement(
    advertisement: Omit<Advertisement, "id" | "image_url" | "created_at">
  ) {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.post<BackendResponse<Advertisement>>(
      "/advertisements",
      advertisement
    );

    if (status !== StatusCodes.CREATED) {
      throw new Error(message);
    }

    return data;
  }

  async updateAdvertisement(
    advertisementId: Advertisement["id"],
    advertisement: Omit<Partial<Advertisement>, "id" | "created_at">
  ) {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.patch<BackendResponse<Advertisement>>(
      `/advertisements/${advertisementId}`,
      advertisement
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }

  async deleteAdvertisement(advertisementId: Advertisement["id"]) {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.delete<BackendResponse<Advertisement>>(
      `/advertisements/${advertisementId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }

  async uploadAdvertisementImage(
    advertisementId: Advertisement["id"],
    image: File
  ) {
    const { path } = await this.storageService.uploadFile(
      image,
      `${advertisementId}/${image.name}`
    );

    return path;
  }

  getAdvertisementImageUrlByPath(path: string) {
    return this.storageService.getFileUrl(`${path}`);
  }
}

export const advertisementService = new AdvertisementService(
  backendClient,
  new StorageService("advertisements", supabase)
);
