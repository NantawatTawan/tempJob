import {
  EducationLevel,
  EducationLevelSchema,
} from '@/features/education-level/schemas/education-level.schema';
import // JobTypeSchema,
// PostedJobSchema,
'@/features/posted-jobs/schemas/posted-job.schema';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';

const JobTypeSchema = z.object({
  id: z.number(),
  title: z
    .string({ message: 'กรุณากรอกชื่อประเภทงาน' })
    .min(1, { message: 'กรุณากรอกชื่อประเภทงาน' }),
  description: z
    .string({ message: 'กรุณากรอกรายละเอียดประเภทงาน' })
    .optional()
    .nullable(),
});

const PostedJobSchema = z.object({
  id: z.string({ message: 'กรุณากรอกรหัสประกาศงาน' }),
  job_type_id: z
    .number({ message: 'Id ประเภทงานต้องเป็นตัวเลข' })
    .optional()
    .nullable(),
  description: z
    .string({ message: 'กรุณากรอกรายละเอียดงาน' })
    .min(50, { message: 'กรุณากรอกรายละเอียดงานอย่างน้อย 50 ตัวอักษร' })
    .optional()
    .nullable(),
  hire_type: z
    .string({ message: 'กรุณากรอกเงื่อนไขการจ่ายค่าจ้าง' })
    .min(1, { message: 'กรุณากรอกเงื่อนไขการจ่ายค่าจ้าง' }),
  min_wage: z.number({ message: 'ค่าจ้างต้องเป็นตัวเลข' }).min(1, {
    message: 'ค่าจ้างต้องมีค่ามากกว่า 0',
  }),
  max_wage: z.number({ message: 'ค่าจ้างต้องเป็นตัวเลข' }).min(1, {
    message: 'ค่าจ้างต้องมีค่ามากกว่า 0',
  }),
  site: z.string({ message: 'กรุณากรอกสถานที่ทำงาน' }).min(1, {
    message: 'กรุณากรอกสถานที่ทำงาน',
  }),
  province: z.string({ message: 'กรุณากรอกจังหวัด' }).min(1, {
    message: 'กรุณากรอกจังหวัด',
  }),
  district: z.string({ message: 'กรุณากรอกอำเภอ' }).min(1, {
    message: 'กรุณากรอกอำเภอ',
  }),
  company_id: z.string({ message: 'กรุณากรอกรหัสบริษัท' }),
  created_at: z.string({ message: 'กรุณากรอกวันที่สร้าง' }),
  expired_at: z.string({ message: 'กรุณากรอกวันที่หมดอายุ' }),
  minimum_education_level_id: EducationLevelSchema.shape.id,
  job_types: JobTypeSchema,
});

const FreelancerInterestinJobTypeSchema = z.object({
  freelancer_id: z.string(),
  job_type_id: z.number(),
  job_types: JobTypeSchema,
});

export type FreelancerInterestinJobType = z.infer<
  typeof FreelancerInterestinJobTypeSchema
>;

const FreelancerContactedJobTypeSchema = z.object({
  job_id: z.string(),
  freelancer_id: z.string(),
  created_at: z.string(),
  id: z.number(),
  job: PostedJobSchema,
});

export type FreelancerContactedJobType = z.infer<
  typeof FreelancerContactedJobTypeSchema
>;

export const FreelancerInfoSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  birth_date: z.string(),
  gender: z.string(),
  province: z.string(),
  district: z.string(),
  sub_district: z.string(),
  education_major_id: z.number(),
  driving_license: z.string().nullable(),
  phone_number: z.string(),
  open_for_contact: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  fullname: z.string(),
  introduction: z.string().nullable(),
  education_level_id: z.number(),
  coins: z.number(),
  current_theme_id: z.number(),
  profile_image_url: z.string(),
  education_major_title: z.string().nullable(),
  education_level_title: z.string(),
  education_level: EducationLevelSchema.nullable(),
  theme_image_url: z.string(),
  reviews: z.number(),
  bookmarked_jobs: z.number(),
  total_job_contacts: z.number(),
  rating_avg: z.number(),
  interesting_job_types: z.array(FreelancerInterestinJobTypeSchema),
  contacted_job_types: z.array(FreelancerContactedJobTypeSchema),
});

export type FreelancerInfo = {
  id: string;
  user_id: User['id'];
  birth_date: string;
  gender: 'ชาย' | 'หญิง';
  province: string;
  district: string;
  sub_district: string;
  education_major_id: number | null;
  driving_license: string | null;
  phone_number: string;
  open_for_contact: boolean;
  created_at: string;
  updated_at: string;
  fullname: string;
  introduction: string | null;
  education_level_id: number;
  coins: number;
  current_theme_id: number;
  profile_image_url: string;
  hometown: string;
  religion: string;
  nationality: string;
  education_major_title: string | null;
  education_level_title: string;
  education_level: EducationLevel | null;
  theme_image_url: string;
  reviews: number;
  bookmarked_jobs: number;
  total_job_contacts: number;
  rating_avg: number;
  interesting_job_types: FreelancerInterestinJobType[] | null;
  contacted_job_types: FreelancerContactedJobType[] | null;
};
