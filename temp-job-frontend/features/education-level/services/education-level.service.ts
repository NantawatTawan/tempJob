import backendClient from "@/lib/axios";
import { BackendResponse } from "@/shared/types/api.type";
import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { EducationLevel } from "../schemas/education-level.schema";

export class EducationLevelService {
  constructor(private readonly backendClient: AxiosInstance) {
    if (!this.backendClient) {
      throw new Error("Backend client is not initialized");
    }
  }

  async getAllEducationLevels() {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<EducationLevel[]>>(
      "/education-levels"
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }

  async getEducationLevelById(id: EducationLevel["id"]) {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<EducationLevel>>(
      `/education-levels/${id}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }
}

export const educationLevelService = new EducationLevelService(backendClient);
