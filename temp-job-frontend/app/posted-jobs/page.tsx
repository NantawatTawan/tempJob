'use client';

import PostedJobCard from '@/features/posted-jobs/components/PostedJobCard';
import {
  calculateRemainingJobsCount,
  getCompanyMaxJobsLimit,
  getJobStatusMessage,
} from '@/features/posted-jobs/helpers/posted-job.helper';
import { useFetchAllJobTypes } from '@/features/posted-jobs/hooks/queries/useFetchAllJobTypes';
import { useFetchPostedJobs } from '@/features/posted-jobs/hooks/queries/useFetchPostedJobs';
import { PostedJobWithViewsAndApplications } from '@/features/posted-jobs/schemas/posted-job.schema';
import { postedJobService } from '@/features/posted-jobs/services/posted-job.service';
import { formatThaiDate } from '@/lib/helpers/date.helper';
import { useAuthRequiredRoute } from '@/shared/components/routes/AuthRequiredRoute';
import { Skeleton } from '@/shared/components/ui/skeleton';
import Link from 'next/link';
import { useState } from 'react';

const PostedJobPage = () => {
  const {
    data: postedJobs,
    isFetching: isFetchingPostedJobs,
    refetch,
  } = useFetchPostedJobs();

  const { subscription, companyInfo } = useAuthRequiredRoute();

  console.log(subscription, companyInfo);

  const { data: jobTypes } = useFetchAllJobTypes();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const filteredJobs = postedJobs?.filter((job) => {
    const jobType = jobTypes?.find((type) => type.id === job.job_type_id);

    return (
      jobType?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'ทั้งหมด' || getJobStatusMessage(job) === statusFilter)
    );
  });

  const jobsPerPage = 5;
  const totalPages = Math.ceil((filteredJobs?.length ?? 0) / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs?.slice(indexOfFirstJob, indexOfLastJob);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await postedJobService.refreshJobDate();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
      refetch();
    }
  };

  return (
    <div className="p-6 pt-24 px-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-xl font-semibold">จัดการประกาศงาน</h1>
          <p>
            <span className="font-semibold">แพคเกจปัจจุบันของคุณคือ</span>{' '}
            {companyInfo.packages?.name}{' '}
            <span className="font-semibold">หมดอายุ</span>{' '}
            {formatThaiDate(subscription.expired_at)}
          </p>
        </div>
        <div className="flex gap-3">
          <Link target="_blank" href="/posted-jobs/create">
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <span>+</span> สร้างประกาศใหม่
            </button>
          </Link>
          <button
            className="border bg-white border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={refreshing ? 'animate-spin' : ''}
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
            </svg>
            {refreshing ? 'กำลังรีเฟรช...' : 'รีเฟรช'}
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm">
        คุณประกาศงานได้อีก{' '}
        {calculateRemainingJobsCount(companyInfo, postedJobs ?? [])} ตำแหน่ง
        (จากทั้งหมด {getCompanyMaxJobsLimit(companyInfo)} ตำแหน่ง)
      </p>

      <div className="flex gap-4 my-6">
        <div className="relative">
          <select
            className="w-32 border border-gray-300 rounded-lg px-3 py-2"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
            <option value="ปิดรับสมัคร">ปิดรับสมัคร</option>
          </select>
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="ค้นหาตำแหน่งงาน"
            className="w-[200px] border border-gray-300 rounded-lg pl-9 pr-3 py-2"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Job listings */}
      <div className="space-y-4">
        {isFetchingPostedJobs ? (
          <div className="flex flex-col gap-y-3">
            <Skeleton className="w-full h-[150px]" />
            <Skeleton className="w-full h-[150px]" />
            <Skeleton className="w-full h-[150px]" />
          </div>
        ) : currentJobs?.length ?? 0 > 0 ? (
          currentJobs?.map((job: PostedJobWithViewsAndApplications) => (
            <PostedJobCard key={job.id} job={job} onRefresh={refetch} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            ไม่พบประกาศงานที่ตรงกับเงื่อนไขการค้นหา
          </div>
        )}
      </div>

      {filteredJobs && filteredJobs.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            className={`text-emerald-600 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← ก่อนหน้า
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`${
                  currentPage === page
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } w-8 h-8 rounded-lg`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className={`text-emerald-600 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            ถัดไป →
          </button>
        </div>
      )}
    </div>
  );
};

export default PostedJobPage;
