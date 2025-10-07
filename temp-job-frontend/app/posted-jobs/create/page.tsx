'use client';
import { useFetchAllEducationLevels } from '@/features/education-level/hooks/queries/useFetchAllEducationLevels';
import { useFetchPackageById } from '@/features/packages/hooks/queries/useFetchPackageById';
import { HIRE_TYP_OPTIONS } from '@/features/posted-jobs/constants/posted-jobs.constant';
import { useFetchAllJobTypes } from '@/features/posted-jobs/hooks/queries/useFetchAllJobTypes';
import { useFetchPostedJobsByCompanyId } from '@/features/posted-jobs/hooks/queries/useFetchPostedJobsByCompanyId';
import { PostedJobSchema } from '@/features/posted-jobs/schemas/posted-job.schema';
import { postedJobService } from '@/features/posted-jobs/services/posted-job.service';
import {
  calculateRemainingJobsCount,
  getCompanyMaxJobsLimit,
} from '@/features/posted-jobs/helpers/posted-job.helper';
import { sortByThai } from '@/lib/utils';
import { useAuthRequiredRoute } from '@/shared/components/routes/AuthRequiredRoute';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Textarea } from '@/shared/components/ui/textarea';
import { useProvinces } from '@/shared/hooks/useProvinces';
import { showErrorAlert, showSuccessAlert } from '@/shared/utils/swal.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = PostedJobSchema.omit({
  id: true,
  created_at: true,
  expired_at: true,
  company_id: true,
  job_types: true,
}).refine((data) => data.max_wage >= data.min_wage, {
  path: ['max_wage'],
  message: 'ค่าจ้างสูงสุดต้องมีค่ามากกว่าค่าจ้างต่ำสุด',
});

type FormFields = z.infer<typeof FormSchema>;

const CreateJobPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  const { companyInfo: company } = useAuthRequiredRoute();

  const { data: postedJobs } = useFetchPostedJobsByCompanyId(company?.id ?? '');

  const { data: packageInfo } = useFetchPackageById(
    Number(company?.package_id) ?? 0
  );

  const { data: educationLevels, isFetching: isFetchingEducationLevels } =
    useFetchAllEducationLevels();

  const [otherHireType, setOtherHireType] = useState('');

  const { hire_type, province, district, job_type_id } = watch();

  const { provinces, amphures } = useProvinces(province, district);

  const { data: jobTypes, isFetching: isFetchingJobTypes } =
    useFetchAllJobTypes();

  const onCreateJob = async (data: FormFields) => {
    try {
      if (!job_type_id) {
        showErrorAlert('กรุณาเลือกตำแหน่งงาน');
        return;
      }

      if (hire_type === 'อื่นๆ' && !otherHireType) {
        showErrorAlert('กรุณาระบุเงื่อนไขการจ่ายค่าจ้างอื่นๆ');
        return;
      }

      await postedJobService.postJob({
        ...data,
        hire_type: hire_type === 'อื่นๆ' ? otherHireType : hire_type,
      });

      showSuccessAlert('สร้างประกาศงานเรียบร้อย');

      router.push('/posted-jobs');
    } catch (error: any) {
      showErrorAlert(error.message);
    }
  };

  return (
    <div className="bg-primary h-full w-full pt-24">
      <form onSubmit={handleSubmit(onCreateJob)} className="px-4 pt-10">
        <section
          id="job-posting-form"
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6"
        >
          <h1 className="text-2xl font-bold mb-6 text-[#00BF63]">
            สร้างประกาศรับสมัครงาน
          </h1>
          <div className="space-y-6">
            {isFetchingJobTypes ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                options={
                  jobTypes
                    ? sortByThai(jobTypes, 'title').map((jobType) => ({
                        value: jobType.id.toString(),
                        label: jobType.title,
                      }))
                    : []
                }
                label="ตำแหน่งงาน"
                error={errors.job_type_id?.message}
                {...register('job_type_id', {
                  setValueAs: (value) => (value ? parseInt(value, 10) : null),
                })}
                placeholder="เลือกตำแหน่งงาน"
              />
            )}
            {isFetchingEducationLevels ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                options={
                  educationLevels?.map((level) => ({
                    value: level.id.toString(),
                    label: level.title,
                  })) ?? []
                }
                label="วุฒิการศึกษาไม่ต่ำกว่า"
                error={errors.minimum_education_level_id?.message}
                {...register('minimum_education_level_id', {
                  setValueAs: (value) => (value ? parseInt(value, 10) : null),
                })}
                placeholder="เลือกวุฒิการศึกษาขั้นต่ำ"
              />
            )}
            <Textarea
              label="รายละเอียดงาน และ คุณสมบัติประจำตำแหน่งงาน"
              {...register('description')}
              placeholder="รายละเอียดงาน และ คุณสมบัติประจำตำแหน่งงาน"
              error={errors.description?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เงื่อนไขการจ่ายค่าจ้าง
              </label>
              <div className="space-y-4">
                <Select
                  options={HIRE_TYP_OPTIONS}
                  {...register('hire_type')}
                  error={errors.hire_type?.message}
                />
                {hire_type === 'อื่นๆ' && (
                  <>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BF63]"
                      placeholder="ระบุเงื่อนไขการจ่ายค่าจ้างอื่นๆ"
                      onChange={(e) => setOtherHireType(e.target.value)}
                      value={otherHireType}
                    />
                    {!otherHireType && (
                      <p className="text-red-500 text-sm">
                        กรุณาระบุเงื่อนไขการจ่ายค่าจ้างอื่นๆ
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  {...register('min_wage', {
                    setValueAs: (value) => (value ? parseInt(value, 10) : null),
                  })}
                  type="number"
                  label="ค่าจ้างต่ำสุด (บาท)"
                  placeholder="ระบุจำนวนเงินขั้นต่ำ"
                  error={errors.min_wage?.message}
                />
              </div>
              <div>
                <Input
                  {...register('max_wage', {
                    setValueAs: (value) => (value ? parseInt(value, 10) : null),
                  })}
                  type="number"
                  label="ค่าจ้างสูงสุด (บาท)"
                  placeholder="ระบุจำนวนเงินขั้นสูง"
                  error={errors.max_wage?.message}
                />
              </div>
            </div>
            <div>
              <Input
                {...register('site')}
                label="สถานที่ปฏิบัติงาน"
                placeholder="ระบุสถานที่ปฏิบัติงาน"
                error={errors.site?.message}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Select
                  options={
                    sortByThai(provinces ?? [], 'value').map((province) => ({
                      value: province.key,
                      label: province.value,
                    })) ?? []
                  }
                  {...register('province')}
                  label="จังหวัด"
                  placeholder="เลือกจังหวัด"
                  error={errors.province?.message}
                />
              </div>
              <div>
                <Select
                  options={
                    sortByThai(amphures ?? [], 'value').map((amphure) => ({
                      value: amphure.key,
                      label: amphure.value,
                    })) ?? []
                  }
                  {...register('district')}
                  label="เขต/อำเภอ"
                  placeholder="เลือกเขต/อำเภอ"
                  error={errors.district?.message}
                />
              </div>
            </div>
            <div className="col-span-2">
              <Input
                label="Location GPS สถานที่ปฏิบัติงาน"
                placeholder="ใช้วิธีการ copy link จาก google map"
                {...register('site_map_url')}
              />
            </div>
            <div className="col-span-2">
              <Textarea
                label="วิธีการเดินทางไปสถานที่ปฏิบัติงาน"
                placeholder="อธิบายวิธีการเดินทาง เช่น รถเมล์, รถไฟฟ้า จากสถานีใดบ้าง"
                {...register('site_transportation_guide')}
                className="min-h-[100px]"
              />
            </div>

            <footer className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  router.push('/posted-jobs');
                }}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#00BF63] text-white rounded-lg hover:bg-[#00A857]"
              >
                ประกาศงาน
              </button>
            </footer>
          </div>
        </section>
      </form>
      <section
        id="package-status"
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#00BF63]">
              แพ็กเกจปัจจุบัน: {packageInfo?.name ?? 'ไม่พบชื่อแพ็กเกจ'}
            </h2>
            <p className="text-sm text-gray-600">
              ประกาศงานได้อีก{' '}
              {calculateRemainingJobsCount(company, postedJobs ?? [])} ตำแหน่ง
              ตำแหน่ง (จากทั้งหมด {getCompanyMaxJobsLimit(company)} ตำแหน่ง)
            </p>
          </div>
          <Link href="/contact">
            <button className="text-[#00BF63] hover:text-[#00A857] font-medium">
              อัพเกรดแพ็กเกจ <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CreateJobPage;
