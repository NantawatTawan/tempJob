import { Company } from '@/features/company/schemas/company.schema';
import {
  PostedJob,
  PostedJobWithViewsAndApplications,
} from '../schemas/posted-job.schema';

export function isJobExpired(job: PostedJob): boolean {
  return job.expired_at < new Date().toISOString();
}

export function getJobStatusMessage(job: PostedJob): string {
  return isJobExpired(job) ? 'ปิดรับสมัคร' : 'เปิดรับสมัคร';
}

export function getJobViewsCount(
  job: PostedJobWithViewsAndApplications
): number {
  return job.views?.length ?? 0;
}

export function getJobApplicationsCount(
  job: PostedJobWithViewsAndApplications
): number {
  return job.applications?.length ?? 0;
}

export function getActivePostedJobsCount(jobs: PostedJob[]): number {
  return jobs.filter((job) => !isJobExpired(job)).length;
}

export function calculateRemainingJobsCount(
  companyInfo: Company,
  postedJobs: PostedJob[]
): number {
  const jobLimit = companyInfo.packages?.jobs_limit ?? 0;

  const activeJobsCount = getActivePostedJobsCount(postedJobs);

  const remainingJobsCount = jobLimit - activeJobsCount;

  return remainingJobsCount > 0 ? remainingJobsCount : 0;
}

export function getCompanyMaxJobsLimit(companyInfo: Company): number {
  const defaultPackageLimit = 15;

  return companyInfo.packages?.jobs_limit ?? defaultPackageLimit;
}
