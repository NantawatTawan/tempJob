import { EducationLevel } from "../models/education-level.model";
import {
  JobApplication,
  JobViewed,
  PostedJob,
  PostedJobWithViewsAndApplications,
} from "../models/posted-job.model";

export function formatPostedJobToPostedJobWithViewsAndApplication(
  postedJob: PostedJob,
  jobViewed: JobViewed[],
  jobApplication: JobApplication[]
): PostedJobWithViewsAndApplications {
  return {
    ...postedJob,
    views: jobViewed,
    applications: jobApplication,
  };
}

export function formatPostedJobToPostedJobWithViewsAndApplications(
  postedJobs: PostedJob[],
  jobViewed: JobViewed[],
  jobApplications: JobApplication[]
): PostedJobWithViewsAndApplications[] {
  return postedJobs.map((postedJob) => {
    return {
      ...postedJob,
      views: jobViewed.filter((view) => view.job_id === postedJob.id),
      applications: jobApplications.filter(
        (application) => application.job_id === postedJob.id
      ),
    };
  });
}

export function hasJobExpired(job: PostedJob): boolean {
  return new Date() >= new Date(job.expired_at);
}

export function hasFreelancerMetTheMinimumEducationLevel(
  minimumEducationLevel: EducationLevel,
  freelancerEducationLevel: EducationLevel
): boolean {
  return freelancerEducationLevel.power >= minimumEducationLevel.power;
}
