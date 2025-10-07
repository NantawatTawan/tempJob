import { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseServiceClient } from "../configs/db.config";
import { translateSupabaseErrorMessage } from "../helpers/supabase.helper";
import {
  Freelancer,
  FreelancerWithEducationLevel,
  ReviewFreelancerParam,
} from "../models/freelancer.model";
import { JobType, PostedJob } from "../models/posted-job.model";
import { Theme } from "../models/theme.model";
import jobTypeService, { JobTypeService } from "./job-type.service";
import { postedJobService } from "./posted-job.service";
import { StorageService, StorageServiceFactory } from "./storage.service";

const FREELANCER_PROFILE_BUCKET_NAME = "freelancer-profile";

export class FreelancerService {
  private _FREELANCER_INFO_VIEW = "freelancer_info_view";
  private _FREELANCER_INTERSTING_JOB_TYPE_TABLE =
    "freelancer_interesting_job_type";
  private _FREELANCER_JOB_CONTACT = "freelancer_job_contact";
  private _FREELANCER_TABLE = "freelancer";
  private _FREELANCER_REVIEW_TABLE = "freelancer_review";

  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly jobTypeService: JobTypeService,
    private readonly storageService: StorageService
  ) {
    if (!this.supabaseClient) {
      throw new Error("Supabase client is required");
    }

    if (!this.jobTypeService) {
      throw new Error("Job type service is required");
    }
  }

  async createFreelancer(userId: User["id"]): Promise<Freelancer> {
    const { data, error } = await this.supabaseClient
      .from(this._FREELANCER_TABLE)
      .insert({ user_id: userId })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async getFreelancers() {
    const { data: freelancers, error: freelancersError } =
      await this.supabaseClient
        .from(this._FREELANCER_INFO_VIEW)
        .select("*, education_level(*)");

    if (freelancersError)
      throw new Error(
        translateSupabaseErrorMessage("ฟรีแลนเซอร์", freelancersError.message)
      );

    const { data: interestingJobTypes, error: interestingJobTypeError } =
      await this.supabaseClient
        .from(this._FREELANCER_INTERSTING_JOB_TYPE_TABLE)
        .select("*, job_types(*)");

    if (interestingJobTypeError)
      throw new Error(
        translateSupabaseErrorMessage(
          "ประเภทงานที่ฟรีแลนเซอร์สนใจ",
          interestingJobTypeError.message
        )
      );

    const { data: jobContacts, error: jobContactError } =
      await this.supabaseClient
        .from(this._FREELANCER_JOB_CONTACT)
        .select("*, job(*)");

    if (jobContactError)
      throw new Error(
        translateSupabaseErrorMessage(
          "การจ้างงานของฟรีแลนเซอร์",
          jobContactError.message
        )
      );

    return freelancers.map((freelancer) => ({
      ...freelancer,
      interesting_job_types: interestingJobTypes.filter(
        (jobType) => jobType.freelancer_id === freelancer.id
      ),
      contacted_job_types: jobContacts.filter(
        (jobContact) => jobContact.freelancer_id === freelancer.id
      ),
    }));
  }

  async getFreelancerById(
    freelancerId: string
  ): Promise<FreelancerWithEducationLevel> {
    const { data: freelancerInfo, error: freelancerInfoError } =
      await this.supabaseClient
        .from(this._FREELANCER_INFO_VIEW)
        .select("*, education_level(*)")
        .eq("id", freelancerId)
        .single();

    if (freelancerInfoError)
      throw new Error(
        translateSupabaseErrorMessage(
          "ฟรีแลนเซอร์",
          freelancerInfoError.message
        )
      );

    const { data: interestingJobTypes, error: interestingJobTypeError } =
      await this.supabaseClient
        .from(this._FREELANCER_INTERSTING_JOB_TYPE_TABLE)
        .select("*, job_types(*)")
        .eq("freelancer_id", freelancerId);

    if (interestingJobTypeError) {
      throw new Error(
        translateSupabaseErrorMessage(
          "ประเภทงานที่ฟรีแลนเซอร์สนใจ",
          interestingJobTypeError.message
        )
      );
    }

    const { data: jobContacts, error: jobContactError } =
      await this.supabaseClient
        .from(this._FREELANCER_JOB_CONTACT)
        .select("*, job(*, job_types(*))")
        .eq("freelancer_id", freelancerId);

    if (jobContactError) {
      throw new Error(
        translateSupabaseErrorMessage(
          "การจ้างงานของฟรีแลนเซอร์",
          jobContactError.message
        )
      );
    }

    return {
      ...freelancerInfo,
      interesting_job_types: interestingJobTypes,
      contacted_job_types: jobContacts,
    };
  }

  async getFreelancerByIds(
    freelancerIds: string[]
  ): Promise<FreelancerWithEducationLevel[]> {
    const { data: freelancerInfo, error: freelancerInfoError } =
      await this.supabaseClient
        .from(this._FREELANCER_INFO_VIEW)
        .select("*, education_level(*)")
        .in("id", freelancerIds);

    if (freelancerInfoError)
      throw new Error(
        translateSupabaseErrorMessage(
          "ฟรีแลนเซอร์",
          freelancerInfoError.message
        )
      );

    const { data: interestingJobTypes, error: interestingJobTypeError } =
      await this.supabaseClient
        .from(this._FREELANCER_INTERSTING_JOB_TYPE_TABLE)
        .select("*, job_types(*)")
        .in("freelancer_id", freelancerIds);

    if (interestingJobTypeError) {
      throw new Error(
        translateSupabaseErrorMessage(
          "ประเภทงานที่ฟรีแลนเซอร์สนใจ",
          interestingJobTypeError.message
        )
      );
    }

    const { data: jobContacts, error: jobContactError } =
      await this.supabaseClient
        .from(this._FREELANCER_JOB_CONTACT)
        .select("*, job(*)")
        .in("freelancer_id", freelancerIds);

    if (jobContactError) {
      throw new Error(
        translateSupabaseErrorMessage(
          "การจ้างงานของฟรีแลนเซอร์",
          jobContactError.message
        )
      );
    }

    return freelancerInfo.map((freelancer) => ({
      ...freelancer,
      interesting_job_types: interestingJobTypes.filter(
        (jobType) => jobType.freelancer_id === freelancer.id
      ),
      contacted_job_types: jobContacts.filter(
        (jobContact) => jobContact.freelancer_id === freelancer.id
      ),
    }));
  }

  async getFreelancerProfileByUserId(userId: string) {
    const { data: freelancerInfo, error } = await this.supabaseClient
      .from(this._FREELANCER_INFO_VIEW)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error)
      throw new Error(
        translateSupabaseErrorMessage("ฟรีแลนเซอร์", error.message)
      );

    const { data: interestingJobTypes, error: interestingJobTypeError } =
      await this.supabaseClient
        .from(this._FREELANCER_INTERSTING_JOB_TYPE_TABLE)
        .select("*")
        .eq("freelancer_id", freelancerInfo.id);

    if (interestingJobTypeError) {
      throw new Error(
        translateSupabaseErrorMessage(
          "ประเภทงานที่ฟรีแลนเซอร์สนใจ",
          interestingJobTypeError.message
        )
      );
    }

    const jobTypes = await this.jobTypeService.getAllJobTypes();

    const { data: jobContacts, error: jobContactError } =
      await this.supabaseClient
        .from(this._FREELANCER_JOB_CONTACT)
        .select("*")
        .eq("freelancer_id", freelancerInfo.id);

    if (jobContactError) {
      throw new Error(
        translateSupabaseErrorMessage(
          "การจ้างงานของฟรีแลนเซอร์",
          jobContactError.message
        )
      );
    }

    const contactedJobs = await postedJobService.getPostedJobByIds(
      jobContacts.map((jobContact) => jobContact.job_id)
    );

    return {
      ...freelancerInfo,
      interesting_job_types: interestingJobTypes.map((jobType) => {
        return jobTypes.find((job) => job.id === jobType.job_type_id);
      }),
      contacted_job_types: contactedJobs.map((job) =>
        jobTypes.find((jobType) => jobType.id === job.job_type_id)
      ),
    };
  }

  async toggleFreelancerOpenForContactStatus(freelancerId: Freelancer["id"]) {
    const freelancer = await this.getFreelancerById(freelancerId);

    const { data, error } = await this.supabaseClient
      .from(this._FREELANCER_TABLE)
      .update({
        open_for_contact: !freelancer.open_for_contact,
      })
      .eq("id", freelancerId)
      .select("*")
      .single();

    if (error)
      throw new Error(
        translateSupabaseErrorMessage("ฟรีแลนเซอร์", error.message)
      );

    return data;
  }

  async updateFreelanceInfo(
    freelancerId: Freelancer["id"],
    freelancerInfo: Partial<Omit<Freelancer, "id" | "user_id">>
  ) {
    const { data, error } = await this.supabaseClient
      .from(this._FREELANCER_TABLE)
      .update({ ...freelancerInfo, updated_at: new Date().toISOString() })
      .eq("id", freelancerId)
      .select("*")
      .single();

    if (error)
      throw new Error(
        translateSupabaseErrorMessage("ฟรีแลนเซอร์", error.message)
      );

    return data;
  }

  async applyThemeForFreelancer(
    freelancerId: Freelancer["id"],
    themeId: Theme["id"]
  ): Promise<void> {
    const { data, error } = await this.supabaseClient
      .from(this._FREELANCER_TABLE)
      .update({ current_theme_id: themeId })
      .eq("id", freelancerId)
      .select("*")
      .single();

    if (error)
      throw new Error(
        translateSupabaseErrorMessage("ฟรีแลนเซอร์", error.message)
      );

    return data;
  }

  async reviewFreelancer({
    freelancerId,
    jobId,
    rating,
    reviewContent,
  }: ReviewFreelancerParam): Promise<void> {
    const { error: reviewError } = await this.supabaseClient
      .from(this._FREELANCER_REVIEW_TABLE)
      .insert({
        freelancer_id: freelancerId,
        job_id: jobId,
        rating,
        review_content: reviewContent,
      });

    if (reviewError)
      throw new Error(
        translateSupabaseErrorMessage("รีวิวฟรีแลนเซอร์", reviewError.message)
      );
  }

  async hasAlreadyBeenReviewed(
    freelancerId: Freelancer["id"],
    jobId: PostedJob["id"]
  ): Promise<boolean> {
    const { data, error } = await this.supabaseClient
      .from(this._FREELANCER_REVIEW_TABLE)
      .select("*")
      .eq("freelancer_id", freelancerId)
      .eq("job_id", jobId);

    if (error)
      throw new Error(
        translateSupabaseErrorMessage("รีวิวฟรีแลนเซอร์", error.message)
      );

    return data.length > 0;
  }

  async addJobContact(
    freelancerId: Freelancer["id"],
    jobId: PostedJob["id"]
  ): Promise<void> {
    const { error } = await this.supabaseClient
      .from(this._FREELANCER_JOB_CONTACT)
      .insert({ freelancer_id: freelancerId, job_id: jobId });

    if (error)
      throw new Error(
        translateSupabaseErrorMessage("การจ้างงานของฟรีแลนเซอร์", error.message)
      );
  }

  async getFreelancerAppliedJobs(freelancerId: Freelancer["id"]) {
    const postedJobs = await postedJobService.getAllPostedJobsByFreelancerId(
      freelancerId
    );

    return postedJobs;
  }

  async removeFreelancerInterestingJobType(
    freelancerId: Freelancer["id"],
    jobTypeId: JobType["id"]
  ): Promise<void> {
    const { error } = await this.supabaseClient
      .from(this._FREELANCER_INTERSTING_JOB_TYPE_TABLE)
      .delete()
      .eq("freelancer_id", freelancerId)
      .eq("job_type_id", jobTypeId);

    if (error)
      throw new Error(
        translateSupabaseErrorMessage(
          "ประเภทงานที่ฟรีแลนเซอร์สนใจ",
          error.message
        )
      );
  }

  async addFreelancerInterestingJobType(
    freelancerId: Freelancer["id"],
    jobTypeId: JobType["id"]
  ): Promise<void> {
    const { error } = await this.supabaseClient
      .from(this._FREELANCER_INTERSTING_JOB_TYPE_TABLE)
      .insert({ freelancer_id: freelancerId, job_type_id: jobTypeId });

    if (error)
      throw new Error(
        translateSupabaseErrorMessage(
          "ประเภทงานที่ฟรีแลนเซอร์สนใจ",
          error.message
        )
      );
  }
}
export const freelancerService = new FreelancerService(
  supabaseServiceClient,
  jobTypeService,
  StorageServiceFactory.createStorageService(
    FREELANCER_PROFILE_BUCKET_NAME,
    supabaseServiceClient
  )
);
