import { getLocalTimeZone, today } from '@internationalized/date';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { supabaseServiceClient } from '../configs/db.config';
import {
  formatPostedJobToPostedJobWithViewsAndApplication,
  formatPostedJobToPostedJobWithViewsAndApplications,
} from '../helpers/posted-job.helper';
import { isNotFoundError } from '../helpers/supabase.helper';
import { Company } from '../models/company.model';
import { Freelancer } from '../models/freelancer.model';
import {
  PostedJob,
  PostedJobWithEducationLevel,
} from '../models/posted-job.model';
import { freelancerService } from './freelancer.service';

export class PostedJobService {
  private _JOB_TABLE = 'job';
  private _JOB_VIEWED_TABLE = 'job_viewed';
  private _JOB_APPLICATION_TABLE = 'job_application';

  constructor(private readonly supabaseClient: SupabaseClient) {
    if (!supabaseClient) throw new Error('Supabase client is required');
  }

  private async _isFreelancerTheJobPoster(
    jobId: PostedJob['id'],
    freelancerId: Freelancer['id']
  ) {
    const { data: jobInfo, error: jobInfoError } = await this.supabaseClient
      .from(this._JOB_TABLE)
      .select('*, company(*)')
      .eq('id', jobId)
      .single();

    if (jobInfoError) throw new Error(jobInfoError.message);

    const freelancerInfo = await freelancerService.getFreelancerById(
      freelancerId
    );

    if (!freelancerInfo) throw new Error('ไม่พบข้อมูล Freelancer');

    return jobInfo.company.user_id === freelancerInfo.user_id;
  }

  async getPostedJobs() {
    return await this.supabaseClient
      .from(this._JOB_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
  }

  async getPostedJobById(
    jobId: PostedJob['id']
  ): Promise<PostedJobWithEducationLevel | null> {
    const { data: jobInfo, error: jobInfoError } = await this.supabaseClient
      .from(this._JOB_TABLE)
      .select('*, education_level(*)')
      .eq('id', jobId)
      .single();

    if (jobInfoError) throw new Error(jobInfoError.message);

    return jobInfo;
  }

  async getPostedJobByIds(jobIds: PostedJob['id'][]) {
    const { data: jobs, error: jobsError } = await this.supabaseClient
      .from(this._JOB_TABLE)
      .select('*')
      .in('id', jobIds);

    if (jobsError) throw new Error(jobsError.message);

    return jobs;
  }

  async getPostedJobsByCompanyId(companyId: Company['id']) {
    const { data: postedJobs, error: postedJobsError } =
      await this.supabaseClient
        .from(this._JOB_TABLE)
        .select('*')
        .eq('company_id', companyId);

    if (postedJobsError) throw new Error(postedJobsError.message);

    return postedJobs;
  }

  async getPostedJobsWithApplicantsAndViews(companyId: string) {
    const { data: postedJobs, error: postedJobsError } =
      await this.supabaseClient
        .from(this._JOB_TABLE)
        .select('*, job_types(*)')
        .order('created_at', { ascending: false })
        .eq('company_id', companyId);

    if (postedJobsError) throw new Error(postedJobsError.message);

    const { data: jobViewed, error: jobViewedError } = await this.supabaseClient
      .from(this._JOB_VIEWED_TABLE)
      .select('*');

    if (jobViewedError) throw new Error(jobViewedError.message);

    const { data: jobApplications, error: jobApplicationsError } =
      await this.supabaseClient.from(this._JOB_APPLICATION_TABLE).select('*');

    if (jobApplicationsError) throw new Error(jobApplicationsError.message);

    return formatPostedJobToPostedJobWithViewsAndApplications(
      postedJobs,
      jobViewed,
      jobApplications
    );
  }

  async getAllPostedJobs() {
    const { data: postedJobs, error: postedJobsError } =
      await this.supabaseClient
        .from(this._JOB_TABLE)
        .select('*, company(*), job_types(*)')
        .order('created_at', { ascending: false });

    if (postedJobsError) throw new Error(postedJobsError.message);

    return postedJobs;
  }

  async getAllPostedJobsByFreelancerId(freelancerId: Freelancer['id']) {
    const { data: postedJobs, error: postedJobsError } =
      await this.supabaseClient
        .from(this._JOB_APPLICATION_TABLE)
        .select('*, job(*, job_types(*), company(*))')
        .eq('freelancer_id', freelancerId);

    if (postedJobsError) throw new Error(postedJobsError.message);

    return postedJobs;
  }

  async incrementJobView(jobId: PostedJob['id'], userId: User['id']) {
    const { data: jobView, error: jobViewError } = await this.supabaseClient
      .from(this._JOB_VIEWED_TABLE)
      .insert({ job_id: jobId, user_id: userId })
      .select()
      .single();

    if (jobViewError) throw new Error(jobViewError.message);

    return jobView;
  }

  async getPostedJobsWithApplicantsAndViewsByJobId(jobId: string) {
    const { data: postedJob, error: postedJobError } = await this.supabaseClient
      .from(this._JOB_TABLE)
      .select('*, job_types(*), company(*), education_level(*)')
      .eq('id', jobId)
      .single();

    if (postedJobError) throw new Error(postedJobError.message);

    const { data: jobViewed, error: jobViewedError } = await this.supabaseClient
      .from(this._JOB_VIEWED_TABLE)
      .select('*')
      .eq('job_id', jobId);

    if (jobViewedError) throw new Error(jobViewedError.message);

    const { data: jobApplications, error: jobApplicationsError } =
      await this.supabaseClient
        .from(this._JOB_APPLICATION_TABLE)
        .select('*, freelancer(*)')
        .eq('job_id', jobId);

    if (jobApplicationsError) throw new Error(jobApplicationsError.message);

    const freelancerIds = jobApplications.map(
      (jobApplication) => jobApplication.freelancer_id
    );

    const freelancers = await freelancerService.getFreelancerByIds(
      freelancerIds
    );

    return formatPostedJobToPostedJobWithViewsAndApplication(
      { ...postedJob, minimum_education_level: postedJob.education_level },
      jobViewed,
      jobApplications.map((jobApplication) => ({
        ...jobApplication,
        freelancer: freelancers.find(
          (freelancer) => freelancer.id === jobApplication.freelancer_id
        ),
      }))
    );
  }

  async hasFreelancerAppliedForJob(
    jobId: PostedJob['id'],
    freelancerId: Freelancer['id']
  ): Promise<boolean> {
    const { data: jobApplication, error: jobApplicationError } =
      await this.supabaseClient
        .from(this._JOB_APPLICATION_TABLE)
        .select('*')
        .eq('job_id', jobId)
        .eq('freelancer_id', freelancerId)
        .single();

    if (jobApplicationError) {
      if (isNotFoundError(jobApplicationError.message)) return false;
      throw new Error(jobApplicationError.message);
    }

    return Boolean(jobApplication);
  }

  async postJob(job: Omit<PostedJob, 'id' | 'created_at' | 'expired_at'>) {
    const { data: postedJob, error: postedJobError } = await this.supabaseClient
      .from(this._JOB_TABLE)
      .insert(job)
      .select()
      .single()
      .returns<PostedJob>();

    if (postedJobError) throw new Error(postedJobError.message);

    return postedJob;
  }

  async deleteJob(jobId: PostedJob['id']) {
    const { data: deletedJob, error: deletedJobError } =
      await this.supabaseClient
        .from(this._JOB_TABLE)
        .delete()
        .eq('id', jobId)
        .select()
        .single();

    if (deletedJobError) throw new Error(deletedJobError.message);

    return deletedJob;
  }

  async disableJob(jobId: PostedJob['id']) {
    const { data: disabledJob, error: disableJobError } =
      await this.supabaseClient
        .from(this._JOB_TABLE)
        .update({
          expired_at: today(getLocalTimeZone()).toString(),
        })
        .eq('id', jobId)
        .select()
        .single();

    if (disableJobError) throw new Error(disableJobError.message);

    return disabledJob;
  }

  async activateJob(jobId: PostedJob['id']) {
    const { data: activatedJob, error: activateJobError } =
      await this.supabaseClient
        .from(this._JOB_TABLE)
        .update({
          expired_at: today(getLocalTimeZone()).add({ days: 30 }).toString(),
        })
        .eq('id', jobId)
        .select()
        .single();

    if (activateJobError) throw new Error(activateJobError.message);

    return activatedJob;
  }

  async refreshAllJobsDateByCompanyId(companyId: string) {
    const { data: refreshedJobs, error: refreshedJobError } =
      await this.supabaseClient
        .from(this._JOB_TABLE)
        .update({
          created_at: new Date().toISOString(),
        })
        .eq('company_id', companyId)
        .select()
        .returns<PostedJob[]>();

    if (refreshedJobError) throw new Error(refreshedJobError.message);

    return refreshedJobs;
  }

  async applyJobForFreelancer(
    jobId: PostedJob['id'],
    freelancerId: Freelancer['id']
  ) {
    const isFreelancerTheJobPoster = await this._isFreelancerTheJobPoster(
      jobId,
      freelancerId
    );

    if (isFreelancerTheJobPoster)
      throw new Error('คุณไม่สามารถสมัครงานของตัวเองได้');

    const { data: appliedJob, error: appliedJobError } =
      await this.supabaseClient
        .from(this._JOB_APPLICATION_TABLE)
        .insert({ job_id: jobId, freelancer_id: freelancerId })
        .select()
        .single();

    if (appliedJobError) throw new Error(appliedJobError.message);

    return appliedJob;
  }

  async hireFreelancer(jobId: PostedJob['id'], freelancerId: Freelancer['id']) {
    const { data: hiredFreelancer, error: hiredFreelancerError } =
      await this.supabaseClient
        .from(this._JOB_APPLICATION_TABLE)
        .insert({ job_id: jobId, freelancer_id: freelancerId })
        .select()
        .single();

    if (hiredFreelancerError) throw new Error(hiredFreelancerError.message);

    return hiredFreelancer;
  }

  async deleteJobApplicationForFreelancer(
    jobId: PostedJob['id'],
    freelancerId: Freelancer['id']
  ) {
    const { data: deletedJobApplication, error: deletedJobApplicationError } =
      await this.supabaseClient
        .from(this._JOB_APPLICATION_TABLE)
        .delete()
        .eq('job_id', jobId)
        .eq('freelancer_id', freelancerId)
        .select()
        .single();

    if (deletedJobApplicationError)
      throw new Error(deletedJobApplicationError.message);

    return deletedJobApplication;
  }
}

export const postedJobService = new PostedJobService(supabaseServiceClient);
