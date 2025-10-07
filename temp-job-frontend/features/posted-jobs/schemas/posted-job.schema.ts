import { EducationLevelSchema } from "@/features/education-level/schemas/education-level.schema";
import { FreelancerInfoSchema } from "@/features/freelancers/schemas/freelancer.schema";
import { z } from "zod";

export const JobTypeSchema = z.object({
  id: z.number({ message: "Id ประเภทงานต้องเป็นตัวเลข" }),
  title: z
    .string({ message: "กรุณากรอกชื่อประเภทงาน" })
    .min(1, { message: "กรุณากรอกชื่อประเภทงาน" }),
  description: z
    .string({ message: "กรุณากรอกรายละเอียดประเภทงาน" })
    .optional()
    .nullable(),
});

export const PostedJobSchema = z.object({
  id: z.string({ message: "กรุณากรอกรหัสประกาศงาน" }),
  job_type_id: z
    .number({ message: "Id ประเภทงานต้องเป็นตัวเลข" })
    .optional()
    .nullable(),
  description: z
    .string({ message: "กรุณากรอกรายละเอียดงาน" })
    .min(50, { message: "กรุณากรอกรายละเอียดงานอย่างน้อย 50 ตัวอักษร" })
    .optional()
    .nullable(),
  hire_type: z
    .string({ message: "กรุณากรอกเงื่อนไขการจ่ายค่าจ้าง" })
    .min(1, { message: "กรุณากรอกเงื่อนไขการจ่ายค่าจ้าง" }),
  min_wage: z.number({ message: "ค่าจ้างต้องเป็นตัวเลข" }).min(1, {
    message: "ค่าจ้างต้องมีค่ามากกว่า 0",
  }),
  max_wage: z.number({ message: "ค่าจ้างต้องเป็นตัวเลข" }).min(1, {
    message: "ค่าจ้างต้องมีค่ามากกว่า 0",
  }),
  site: z.string({ message: "กรุณากรอกสถานที่ทำงาน" }).min(1, {
    message: "กรุณากรอกสถานที่ทำงาน",
  }),
  province: z.string({ message: "กรุณากรอกจังหวัด" }).min(1, {
    message: "กรุณากรอกจังหวัด",
  }),
  district: z.string({ message: "กรุณากรอกอำเภอ" }).min(1, {
    message: "กรุณากรอกอำเภอ",
  }),
  site_map_url: z.string().nullable(),
  site_transportation_guide: z.string().nullable(),
  company_id: z.string({ message: "กรุณากรอกรหัสบริษัท" }),
  created_at: z.string({ message: "กรุณากรอกวันที่สร้าง" }),
  expired_at: z.string({ message: "กรุณากรอกวันที่หมดอายุ" }),
  minimum_education_level_id: EducationLevelSchema.shape.id,
  job_types: JobTypeSchema,
  driving_license_requirement: z.string().optional().nullable(),
});

export const JobViewedSchema = z.object({
  job_id: z.string(),
  user_id: z.string(),
  created_at: z.string(),
});

export const JobApplicationSchema = z.object({
  job_id: z.string(),
  freelancer_id: z.string(),
  created_at: z.string(),
  status: z.string(),
  is_reviewed: z.boolean(),
  freelancer: FreelancerInfoSchema,
});

export const PostedJobWithViewsAndApplicationsSchema = PostedJobSchema.extend({
  views: z.array(JobViewedSchema),
  applications: z.array(JobApplicationSchema),
});

export type PostedJob = z.infer<typeof PostedJobSchema>;
export type JobViewed = z.infer<typeof JobViewedSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;
export type PostedJobWithViewsAndApplications = z.infer<
  typeof PostedJobWithViewsAndApplicationsSchema
>;
export type JobType = z.infer<typeof JobTypeSchema>;
