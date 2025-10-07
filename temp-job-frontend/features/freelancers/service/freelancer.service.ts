import { AxiosInstance } from "axios";
import { FreelancerInfo } from "../schemas/freelancer.schema";
import { BackendResponse } from "@/shared/types/api.type";
import { StatusCodes } from "http-status-codes";
import backendClient from "@/lib/axios";
import { PostedJob } from "@/features/posted-jobs/schemas/posted-job.schema";

export class FreelancerService {
  constructor(private readonly backendClient: AxiosInstance) {
    if (!this.backendClient) {
      throw new Error("backendClient is required");
    }
  }

  async getFreelancers(): Promise<FreelancerInfo[]> {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<FreelancerInfo[]>>(
      "/freelancer"
    );

    if (status !== StatusCodes.OK) throw new Error(message);

    return data ?? [];
  }

  async getFreelancerById(id: string): Promise<FreelancerInfo | null> {
    const {
      data: { data, message },
      status,
    } = await this.backendClient.get<BackendResponse<FreelancerInfo>>(
      `/freelancer/${id}`
    );

    if (status !== StatusCodes.OK) throw new Error(message);

    return data ?? null;
  }

  async reviewFreelancer({
    freelancerId,
    rating,
    reviewContent,
    jobId,
  }: {
    freelancerId: FreelancerInfo["id"];
    rating: number;
    reviewContent: string;
    jobId: PostedJob["id"];
  }) {
    const {
      data: { message },
      status,
    } = await this.backendClient.post<BackendResponse<null>>(
      `/freelancer/${freelancerId}/review?jobId=${jobId}&rating=${rating}&reviewContent=${reviewContent}`
    );

    if (status !== StatusCodes.CREATED) throw new Error(message);
  }
}

export const freelancerService = new FreelancerService(backendClient);
