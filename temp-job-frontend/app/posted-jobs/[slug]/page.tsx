"use client";
import { useFetchEducationLevelById } from "@/features/education-level/hooks/queries/useFetchEducationLevelById";
import JobApplicants from "@/features/posted-jobs/components/JobApplicants";
import JobInfo from "@/features/posted-jobs/components/JobInfo";
import {
  getJobApplicationsCount,
  getJobStatusMessage,
  getJobViewsCount,
} from "@/features/posted-jobs/helpers/posted-job.helper";
import { useFetchJobTypeById } from "@/features/posted-jobs/hooks/queries/useFetchJobTypeById";
import { useFetchPostedJobById } from "@/features/posted-jobs/hooks/queries/useFetchPostedJobById";
import { postedJobService } from "@/features/posted-jobs/services/posted-job.service";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const PostedJobDetailPage = () => {
  const { slug: jobId } = useParams();

  const { data: jobInfo, isFetching: isFetchingJobInfo } =
    useFetchPostedJobById(jobId as string);

  const { data: jobType } = useFetchJobTypeById(jobInfo?.job_type_id as number);

  const { data: educationLevel } = useFetchEducationLevelById(
    jobInfo?.minimum_education_level_id as number
  );

  useEffect(() => {
    (async () => {
      await postedJobService.incremenetJobView(jobId as string);
    })();
  }, [jobId]);

  if (isFetchingJobInfo) return <div>Loading...</div>;

  if (!jobInfo) return <div>ไม่พบข้อมูลงานที่ต้องการ</div>;

  return (
    <div id="job-details" className="bg-primary h-full p-24">
      <div id="header" className="mb-8 bg-white p-5 rounded-lg">
        <div className="flex items-center gap-3 mb-6">
          <a href="#" className="text-green-600 hover:text-green-800">
            <i className="fa-solid fa-arrow-left"></i>
          </a>
          <h1 className="text-2xl font-bold text-green-900">
            {jobType?.title}
          </h1>
          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
            {getJobStatusMessage(jobInfo)}
          </span>
        </div>
        <div className="flex gap-6 items-center text-green-600">
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-user"></i>
            <span>{getJobApplicationsCount(jobInfo)} คนสมัคร</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-eye"></i>
            <span>{getJobViewsCount(jobInfo)} การเข้าชม</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-clock"></i>
            <span>
              หมดอายุ{" "}
              {new Date(jobInfo.expired_at).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <div id="job-content" className="grid grid-cols-3 gap-6">
        <JobInfo
          jobTypeTitle={jobType?.title as string}
          minWage={jobInfo.min_wage}
          maxWage={jobInfo.max_wage}
          site={jobInfo.site}
          province={jobInfo.province}
          district={jobInfo.district}
          hireType={jobInfo.hire_type}
          educationLevel={educationLevel?.title ?? "ไม่มีข้อมูล"}
          description={jobInfo.description}
          siteMapUrl={jobInfo.site_map_url ?? undefined}
          guideline={jobInfo.site_transportation_guide ?? undefined}
          drivingLicenseRequirement={jobInfo.driving_license_requirement}
        />
        <JobApplicants applicants={jobInfo.applications ?? []} />
      </div>
    </div>
  );
};

export default PostedJobDetailPage;
