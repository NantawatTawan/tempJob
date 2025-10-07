import { z } from "zod";
import { UserInfoSchema } from "./user.model";
import { EducationLevel } from "./education-level.model";
import { PostedJobSchema } from "./posted-job.model";
const FREELANCER_ID_LENGTH = 36;
const PHONE_NUMBER_LENGTH = 10;

export const FreelancerSchema = z.object({
  id: z
    .string({ message: "รหัสฟรีแลนเซอร์ต้องเป็นข้อมูลประเภท string" })
    .refine((id) => id.length === FREELANCER_ID_LENGTH, {
      message: `รหัสฟรีแลนเซอร์ต้องมี ${FREELANCER_ID_LENGTH} ตัวอักษร`,
    }),
  user_id: UserInfoSchema.shape.id,
  birth_date: z
    .string({ message: "ข้อมูลวันเกิดต้องเป็นข้อมูลประเภท string" })
    .date("ข้อมูลวันเกิดต้องเป็นวันที่"),
  gender: z.enum(["ชาย", "หญิง"]),
  province: z.string({ message: "ข้อมูลจังหวัดต้องเป็นข้อมูลประเภท string" }),
  district: z.string({ message: "ข้อมูลอำเภอต้องเป็นข้อมูลประเภท string" }),
  sub_district: z.string({
    message: "ข้อมูลตำบลต้องเป็นข้อมูลประเภท string",
  }),
  driving_license: z.string().nullable(),
  phone_number: z
    .string({
      message: "ข้อมูลเบอร์โทรต้องเป็นข้อมูลประเภท string",
    })
    .refine((phone) => phone.length === PHONE_NUMBER_LENGTH, {
      message: `ข้อมูลเบอร์โทรต้องมี ${PHONE_NUMBER_LENGTH} ตัวอักษร`,
    }),
  open_for_contact: z.boolean({
    message: "สถานะต้องเป็นค่าตรรกะ",
  }),
  created_at: z.string({ message: "วันที่สร้างต้องเป็นวันที่" }).optional(),
  updated_at: z.string({ message: "วันที่อัพเดตต้องเป็นวันที่" }).optional(),
  fullname: z.string({ message: "ชื่อฟรีแลนเซอร์ต้องเป็นข้อมูลประเภท string" }),
  education_major_id: z.number({
    message: "ข้อมูลสาขาวิชาต้องเป็นข้อมูลประเภท number",
  }),
  introduction: z.string({
    message: "ข้อมูลคำนิยามต้องเป็นข้อมูลประเภท string",
  }),
  education_level_id: z
    .number({
      message: "ข้อมูลระดับการศึกษาต้องเป็นข้อมูลประเภท number",
    })
    .nullable(),
  coins: z.number({
    message: "ข้อมูลจำนวนเหรียญต้องเป็นข้อมูลประเภท number",
  }),
  profile_image_url: z
    .string({
      message: "ข้อมูลลิงค์รูปภาพต้องเป็นข้อมูลประเภท string",
    })
    .nullable(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  hometown: z.string().optional(),
});

export const ReviewFreelancerParamSchema = z.object({
  freelancerId: FreelancerSchema.shape.id,
  jobId: PostedJobSchema.shape.id,
  rating: z
    .number({ message: "คะแนนต้องเป็นข้อมูลประเภท number" })
    .min(1, { message: "คะแนนต้องมีค่ามากกว่า 0" })
    .max(5, { message: "คะแนนต้องมีค่าไม่เกิน 5" }),
  reviewContent: z.string({
    message: "ข้อมูลรายละเอียดรีวิวต้องเป็นข้อมูลประเภท string",
  }),
});

export type Freelancer = z.infer<typeof FreelancerSchema>;
export type FreelancerWithEducationLevel = Freelancer & {
  education_level: EducationLevel;
};
export type ReviewFreelancerParam = z.infer<typeof ReviewFreelancerParamSchema>;
