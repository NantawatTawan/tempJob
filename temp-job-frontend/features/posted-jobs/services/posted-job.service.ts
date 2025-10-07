import { Company } from "@/features/company/schemas/company.schema";
import backendClient from "@/lib/axios";
import { BackendResponse } from "@/shared/types/api.type";
import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import {
  JobType,
  PostedJob,
  PostedJobWithViewsAndApplications,
} from "../schemas/posted-job.schema";
import { FreelancerInfo } from "@/features/freelancers/schemas/freelancer.schema";

export class PostedJobService {
  constructor(private readonly backendClient: AxiosInstance) {
    if (!this.backendClient) throw new Error("Backend client is not set");
  }

  async getPostedJobsWithViewsAndApplicationsByJobId(
    jobId: PostedJob["id"]
  ): Promise<PostedJobWithViewsAndApplications | null> {
    const {
      data: { data: postedJob, message },
      status,
    } = await this.backendClient.get<
      BackendResponse<PostedJobWithViewsAndApplications>
    >(`/posted-jobs/detail/${jobId}`);

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return postedJob;
  }

  async getPostedJobsWithViewsAndApplications() {
    const {
      data: { data: postedJobs, message },
      status,
    } = await this.backendClient.get<
      BackendResponse<PostedJobWithViewsAndApplications[]>
    >("/posted-jobs");

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return postedJobs ?? [];
  }

  async postJob(
    newJob: Omit<
      PostedJob,
      "id" | "created_at" | "expired_at" | "company_id" | "job_types"
    >
  ) {
    const {
      data: { data: postedJob, message },
      status,
    } = await this.backendClient.post<BackendResponse<PostedJob>>(
      "/posted-jobs",
      {
        job: newJob,
      }
    );

    if (status !== StatusCodes.CREATED) {
      throw new Error(message);
    }

    return postedJob;
  }

  async getAllJobTypes(): Promise<JobType[]> {
    const {
      data: { data: jobTypes, message },
      status,
    } = await this.backendClient.get<BackendResponse<JobType[]>>("/job-types");

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return jobTypes ?? [];
  }

  async getJobTypeById(jobTypeId: JobType["id"]): Promise<JobType | null> {
    const {
      data: { data: jobType, message },
      status,
    } = await this.backendClient.get<BackendResponse<JobType>>(
      `/job-types/${jobTypeId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return jobType;
  }

  async incremenetJobView(jobId: PostedJob["id"]): Promise<null> {
    const {
      data: { message },
      status,
    } = await this.backendClient.post<BackendResponse<null>>(
      `/posted-jobs/detail/${jobId}/view`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return null;
  }

  async deleteJob(jobId: PostedJob["id"]): Promise<PostedJob | null> {
    const {
      data: { data: deletedJob, message },
      status,
    } = await this.backendClient.delete<BackendResponse<PostedJob>>(
      `/posted-jobs/${jobId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return deletedJob;
  }

  async disableJob(jobId: PostedJob["id"]): Promise<PostedJob | null> {
    const {
      data: { data: disabledJob, message },
      status,
    } = await this.backendClient.patch<BackendResponse<PostedJob>>(
      `/posted-jobs/detail/${jobId}/disable`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return disabledJob;
  }

  async activateJob(jobId: PostedJob["id"]): Promise<PostedJob | null> {
    const {
      data: { data: activatedJob, message },
      status,
    } = await this.backendClient.patch<BackendResponse<PostedJob>>(
      `/posted-jobs/detail/${jobId}/activate`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return activatedJob;
  }

  async refreshJobDate(): Promise<null> {
    const {
      data: { message },
      status,
    } = await this.backendClient.post<BackendResponse<null>>(
      `/posted-jobs/refresh-date`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return null;
  }

  async getPostedJobsByCompanyId(
    companyId: Company["id"]
  ): Promise<PostedJob[]> {
    const {
      data: { data: postedJobs, message },
      status,
    } = await this.backendClient.get<BackendResponse<PostedJob[]>>(
      `/posted-jobs/company/${companyId}`
    );

    if (status !== StatusCodes.OK) {
      throw new Error(message);
    }

    return postedJobs ?? [];
  }

  async hireFreelancer(
    jobId: PostedJob["id"],
    freelancerId: FreelancerInfo["id"]
  ): Promise<null> {
    const {
      data: { message },
      status,
    } = await this.backendClient.post<BackendResponse<null>>(
      `/posted-jobs/${jobId}/hire/freelancer/${freelancerId}`
    );

    if (status !== StatusCodes.CREATED) {
      throw new Error(message);
    }

    return null;
  }
}

export const postedJobService = new PostedJobService(backendClient);
