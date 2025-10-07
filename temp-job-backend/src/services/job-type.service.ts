import { SupabaseClient } from "@supabase/supabase-js";
import { JobType } from "../models/posted-job.model";
import { supabaseServiceClient } from "../configs/db.config";

export class JobTypeService {
  private _JOB_TYPE_TABLE = "job_types";

  constructor(private readonly supabaseClient: SupabaseClient) {}

  async getAllJobTypes(): Promise<JobType[]> {
    const { data: jobTypes, error: jobTypesError } = await this.supabaseClient
      .from(this._JOB_TYPE_TABLE)
      .select("*");

    if (jobTypesError) throw new Error(jobTypesError.message);

    return jobTypes;
  }

  async getJobTypeById(jobTypeId: JobType["id"]) {
    const { data: jobType, error: jobTypeError } = await this.supabaseClient
      .from(this._JOB_TYPE_TABLE)
      .select("*")
      .eq("id", jobTypeId)
      .single();

    if (jobTypeError) throw new Error(jobTypeError.message);

    return jobType;
  }

  async createNewJobType(jobType: Omit<JobType, "id">) {
    const { data: newJobType, error: newJobTypeError } =
      await this.supabaseClient
        .from(this._JOB_TYPE_TABLE)
        .insert(jobType)
        .select()
        .single();

    if (newJobTypeError) throw new Error(newJobTypeError.message);

    return newJobType;
  }

  async updateJobTypeById(
    jobTypeId: JobType["id"],
    jobType: Omit<JobType, "id">
  ) {
    const { data: updatedJobType, error: updatedJobTypeError } =
      await this.supabaseClient
        .from(this._JOB_TYPE_TABLE)
        .update(jobType)
        .eq("id", jobTypeId)
        .select()
        .single();

    if (updatedJobTypeError) throw new Error(updatedJobTypeError.message);

    return updatedJobType;
  }

  async deleteJobTypeById(jobTypeId: JobType["id"]) {
    const { data: deletedJobType, error: deletedJobTypeError } =
      await this.supabaseClient
        .from(this._JOB_TYPE_TABLE)
        .delete()
        .eq("id", jobTypeId);

    if (deletedJobTypeError) throw new Error(deletedJobTypeError.message);

    return deletedJobType;
  }
}

const jobTypeService = new JobTypeService(supabaseServiceClient);

export default jobTypeService;
