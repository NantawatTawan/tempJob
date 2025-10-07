import backendClient from "@/lib/axios";
import { BackendResponse } from "@/shared/types/api.type";
import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { EducationMajor } from "../schemas/education-major.schema";

export class EducationMajorService {
  constructor(private readonly backendClient: AxiosInstance) {
    if (!backendClient) {
      throw new Error("Backend client is required");
    }
  }

  async getAllEducationMajors() {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<EducationMajor[]>>(
      "/education-majors"
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }

  async createEducationMajor(educationMajor: Omit<EducationMajor, "id">) {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.post<BackendResponse<EducationMajor>>(
      "/education-majors",
      educationMajor
    );

    if (status !== StatusCodes.CREATED) {
      throw new Error(message);
    }

    return data;
  }

  async getEducationMajorById(id: number) {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<EducationMajor>>(
      `/education-majors/${id}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }

  async updateEducationMajor(
    id: number,
    educationMajor: Partial<EducationMajor>
  ) {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.patch<BackendResponse<EducationMajor>>(
      `/education-majors/${id}`,
      educationMajor
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }

  async deleteEducationMajor(id: number) {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.delete<BackendResponse<null>>(
      `/education-majors/${id}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }
}

export const educationMajorService = new EducationMajorService(backendClient);
