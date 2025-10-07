'use client';
import FreelancerContactedJob from '@/features/freelancers/components/FreelancerContactedJob';
import { FreelancerStars } from '@/features/freelancers/components/FreelancerStars';
import { getFreelancerAge } from '@/features/freelancers/helpers/freelancer.helper';
import { useFetchFreelancer } from '@/features/freelancers/hooks/queries/useFetchFreelancer';
import { useFetchPostedJobs } from '@/features/posted-jobs/hooks/queries/useFetchPostedJobs';
import { PostedJob } from '@/features/posted-jobs/schemas/posted-job.schema';
import { postedJobService } from '@/features/posted-jobs/services/posted-job.service';
import { sortByThai } from '@/lib/utils';
import { showErrorAlert, showSuccessAlert } from '@/shared/utils/swal.utils';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const FreelanceDetailPage = () => {
  const { data: postedJobs, isFetching: isFetchingPostedJobs } =
    useFetchPostedJobs();

  const [selectedPostedJob, setSelectedPostedJob] = useState<PostedJob | null>(
    null
  );

  const { slug } = useParams();

  const router = useRouter();

  const { data: freelancer, isFetching: isFetchingFreelancer } =
    useFetchFreelancer(slug as string);

  const uniqueContactedJobTypes = freelancer?.contacted_job_types?.filter(
    (job, index, self) =>
      index === self.findIndex((t) => t.job.id === job.job.id)
  );

  async function handleHireFreelancer() {
    try {
      if (!selectedPostedJob) return;

      try {
        await postedJobService.hireFreelancer(
          selectedPostedJob.id,
          slug as string
        );

        showSuccessAlert('จ้างงานสำเร็จ');

        router.push(`/posted-jobs/${selectedPostedJob.id}`);
      } catch (error: any) {
        showErrorAlert(error.message);
      }
    } catch (error: any) {
      console.error(`Failed to hire freelancer >> ${error.message}`);
      showErrorAlert('ล้มเหลวระหว่างการจ้างงาน');
    }
  }

  if (isFetchingFreelancer) return <div>Loading...</div>;

  if (!freelancer) return <div>ไม่พบข้อมูล freelance ดังกล่าว</div>;

  return (
    <div id="worker-profile" className="bg-green-50 h-full pt-24 px-24">
      <main className="px-6 max-w-6xl mx-auto pb-20 pt-10">
        <section
          id="profile-header"
          className="bg-white rounded-2xl shadow-sm mb-6 border border-green-100 relative overflow-hidden"
        >
          <div
            style={{ backgroundImage: `url(${freelancer.theme_image_url})` }}
            className="flex items-center gap-10 relative p-6"
          >
            <Image
              src={freelancer.profile_image_url}
              className="rounded-full object-cover border-4 border-green-100"
              alt="Profile"
              width={300}
              height={300}
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className='bg-white p-6 rounded-2xl'>
                  <h2 className="text-xl font-semibold text-green-900">
                    {freelancer.fullname}
                  </h2>
                  <FreelancerStars
                    rating={freelancer.rating_avg}
                    count={freelancer.reviews}
                    showCount
                  />
                  <p className="text-green-600 mt-2">
                    ได้รับการติดต่อ {freelancer.total_job_contacts ?? 0} ครั้ง
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="personal-info"
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-green-900">
            ข้อมูลส่วนตัว
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-green-600">วันเกิด</p>
              <p className="font-medium text-green-900">
                {freelancer.birth_date}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-green-600">ภูมิลำเนา</p>
              <p className="font-medium text-green-900">
                {freelancer.hometown}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-green-600">สัญชาติ</p>
              <p className="font-medium text-green-900">
                {freelancer.nationality}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-green-600">ศาสนา</p>
              <p className="font-medium text-green-900">
                {freelancer.religion}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-green-600">อายุ</p>
              <p className="font-medium text-green-900">
                {getFreelancerAge(freelancer)} ปี
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-green-600">เพศ</p>
              <p className="font-medium text-green-900">{freelancer.gender}</p>
            </div>
            <div className="space-y-1">
              <p className="text-green-600">เบอร์ติดต่อ</p>
              <p className="font-medium text-green-900">
                {freelancer.open_for_contact
                  ? freelancer.phone_number
                  : 'XXX-XXX-XXXX'}
              </p>
            </div>
          </div>
        </section>
        <section
          id="location-info"
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-green-900">ที่อยู่</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-green-600">ภูมิลำเนา</p>
                <p className="font-medium text-green-900">
                  {freelancer.province}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-green-600">ที่อยู่ปัจจุบัน</p>
                <p className="font-medium text-green-900">
                  {freelancer.district}, {freelancer.province}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="qualification-info"
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-green-900">
            คุณสมบัติ
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-green-600">วุฒิการศึกษา</p>
                <p className="font-medium text-green-900">
                  {freelancer.education_level_title ?? 'ไม่มีข้อมูล'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-green-600">ใบขับขี่</p>
                <p className="font-medium text-green-900">
                  {freelancer.driving_license || 'ไม่มี'}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="work-history"
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-green-900">
            ประวัติการทำงานที่ได้รับการรีวิว
          </h3>
          <div className="space-y-4">
            {uniqueContactedJobTypes?.map((contacted_job) => (
              <FreelancerContactedJob
                key={contacted_job.job.id}
                contactedJobType={contacted_job}
                allContactedJobTypes={freelancer.contacted_job_types ?? []}
              />
            ))}
          </div>
        </section>
        <section
          id="work-preferences"
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-green-900">
            ความสนใจงาน
          </h3>
          <div className="flex flex-wrap gap-2">
            {freelancer.interesting_job_types?.map((jobType) => (
              <span
                key={jobType.job_type_id}
                className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
              >
                {jobType.job_types.title}
              </span>
            ))}
          </div>
        </section>
        <section
          id="hire-action"
          className="bg-white rounded-xl shadow-sm p-6 border border-green-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-green-900">
            เลือกงานที่ต้องการจัดเก็บใบสมัคร
          </h3>
          <select
            className="p-3 border border-green-200 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            onChange={(e) => {
              const job = postedJobs?.find((job) => job.id === e.target.value);
              setSelectedPostedJob(job ?? null);
            }}
          >
            <option value="">เลือกตำแหน่งงาน</option>
            {postedJobs &&
              sortByThai(postedJobs, 'hire_type').map((job: PostedJob) => (
                <option key={job.id} value={job.id}>
                  {job.job_types.title} - {job.hire_type} - {job.site}
                </option>
              ))}
            {isFetchingPostedJobs && (
              <option disabled>กำลังโหลดข้อมูล...</option>
            )}
            {!postedJobs?.length && !isFetchingPostedJobs && (
              <option disabled>ไม่พบข้อมูลตำแหน่งงาน</option>
            )}
          </select>
          <button
            disabled={!selectedPostedJob}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleHireFreelancer}
          >
            จัดเก็บใบสมัคร
          </button>
          {!selectedPostedJob && (
            <p className="text-red-500 text-sm mt-2 text-center font-semibold">
              กรุณาเลือกตำแหน่งงานที่ต้องการเก็บใบสมัคร
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default FreelanceDetailPage;
