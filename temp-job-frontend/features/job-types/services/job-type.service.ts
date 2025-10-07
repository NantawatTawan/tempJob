import { JobType } from "@/features/posted-jobs/schemas/posted-job.schema";
import backendClient from "@/lib/axios";
import { BackendResponse } from "@/shared/types/api.type";
import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";

export class JobTypeService {
  constructor(private readonly backendClient: AxiosInstance) {
    if (!backendClient) {
      throw new Error("Backend client is not initialized");
    }
  }

  async createNewJobType(
    newJobType: Omit<JobType, "id">
  ): Promise<JobType | null> {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.post<BackendResponse<JobType>>(
      "/job-types",
      newJobType
    );

    if (status !== StatusCodes.CREATED) {
      throw new Error(message);
    }
    return data;
  }

  async updateJobTypeById(
    jobTypeId: JobType["id"],
    updatedJobType: Omit<Partial<JobType>, "id">
  ): Promise<JobType | null> {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.patch<BackendResponse<JobType>>(
      `/job-types/${jobTypeId}`,
      updatedJobType
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }

  async deleteJobTypeById(jobTypeId: JobType["id"]): Promise<JobType | null> {
    const {
      status,
      data: { data, message },
    } = await this.backendClient.delete<BackendResponse<JobType>>(
      `/job-types/${jobTypeId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return data;
  }
}

export const jobTypeService = new JobTypeService(backendClient);
