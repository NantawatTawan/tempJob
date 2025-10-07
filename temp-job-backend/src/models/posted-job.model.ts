import { z } from "zod";
import { EducationLevelSchema, EducationLevel } from "./education-level.model";

export const JobTypeSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional().nullable(),
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
  min_wage: z.number({ message: "ค่าจ้างขั้นต่ำต้องเป็นตัวเลข" }).min(1, {
    message: "ค่าจ้างขั้นต่ำต้องมีค่ามากกว่า 0",
  }),
  max_wage: z.number({ message: "ค่าจ้างขั้นสูงสุดต้องเป็นตัวเลข" }).min(1, {
    message: "ค่าจ้างขั้นสูงสุดต้องมีค่ามากกว่า 0",
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
  company_id: z.string({ message: "กรุณากรอกรหัสบริษัท" }),
  created_at: z.string({ message: "กรุณากรอกวันที่สร้าง" }),
  expired_at: z.string({ message: "กรุณากรอกวันที่หมดอายุ" }),
  minimum_education_level_id: EducationLevelSchema.shape.id,
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
});

export const PostedJobWithViewsAndApplicationsSchema = PostedJobSchema.extend({
  views: z.array(JobViewedSchema),
  applications: z.array(JobApplicationSchema),
});

export type JobViewed = z.infer<typeof JobViewedSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;
export type PostedJobWithViewsAndApplications = z.infer<
  typeof PostedJobWithViewsAndApplicationsSchema
>;

export type PostedJob = z.infer<typeof PostedJobSchema>;
export type PostedJobWithEducationLevel = PostedJob & {
  education_level: EducationLevel;
};
export type JobType = z.infer<typeof JobTypeSchema>;
