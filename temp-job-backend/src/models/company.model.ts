import { z } from "zod";

export const CompanyTypeSchema = z.object({
  id: z.number({ message: "กรุณากรอกรหัสประเภทบริษัท" }),
  created_at: z.string().optional(),
  title: z.string().min(1, {
    message: "กรุณากรอกชื่อประเภทบริษัท",
  }),
  description: z.string().optional(),
});

export const CompanySchema = z.object({
  id: z.string({ message: "กรุณากรอกรหัสบริษัท" }),
  user_id: z.string({ message: "กรุณากรอกรหัสผู้ใช้งาน" }),
  company_name: z.string({ message: "กรุณากรอกชื่อบริษัท" }).min(1, {
    message: "กรุณากรอกชื่อบริษัท",
  }),
  company_type: z.string({ message: "กรุณากรอกประเภทบริษัท" }).min(1, {
    message: "กรุณากรอกประเภทบริษัท",
  }),
  additional_info: z.string({ message: "กรุณากรอกข้อมูลเพิ่มเติม" }).min(1, {
    message: "กรุณากรอกข้อมูลเพิ่มเติม",
  }),
  address: z.string({ message: "กรุณากรอกที่อยู่บริษัท" }).min(1, {
    message: "กรุณากรอกที่อยู่บริษัท",
  }),
  province: z.string({ message: "กรุณากรอกจังหวัด" }).min(1, {
    message: "กรุณากรอกจังหวัด",
  }),
  district: z.string({ message: "กรุณากรอกอำเภอ" }).min(1, {
    message: "กรุณากรอกอำเภอ",
  }),
  sub_district: z.string({ message: "กรุณากรอกตำบล" }).min(1, {
    message: "กรุณากรอกตำบล",
  }),
  zip_code: z
    .string({ message: "กรุณากรอกรหัสไปรษณีย์" })
    .min(1, {
      message: "กรุณากรอกรหัสไปรษณีย์",
    })
    .refine(
      (data) => {
        return /^\d+$/.test(data);
      },
      {
        message: "รหัสไปรษณีย์ต้องเป็นตัวเลข",
      }
    ),
  company_contact_person_name: z
    .string({ message: "กรุณากรอกชื่อผู้ติดต่อบริษัท" })
    .min(1, {
      message: "กรุณากรอกชื่อผู้ติดต่อบริษัท",
    }),
  company_phone_number: z
    .string({ message: "กรุณากรอกเบอร์โทรบริษัท" })
    .min(1, {
      message: "กรุณากรอกเบอร์โทรบริษัท",
    })
    .refine(
      (data) => {
        return /^\d+$/.test(data);
      },
      {
        message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข",
      }
    ),
  company_email: z
    .string({ message: "กรุณากรอกอีเมลบริษัท" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  transportation_guide: z
    .string({ message: "กรุณากรอกข้อมูลการขนส่ง" })
    .min(1, {
      message: "กรุณากรอกข้อมูลการขนส่ง",
    }),
  company_location_map_url: z
    .string({ message: "กรุณากรอกลิงค์ที่พิมพ์แผนที่บริษัท" })
    .min(1, {
      message: "กรุณากรอกลิงค์ที่พิมพ์แผนที่บริษัท",
    })
    .refine(
      (url) => {
        return url.startsWith("https://");
      },
      {
        message: "ลิงค์ต้องเริ่มต้นด้วย https://",
      }
    ),
  welfare: z.string({ message: "กรุณากรอกข้อมูลสวัสดิการ" }).min(1, {
    message: "กรุณากรอกข้อมูลสวัสดิการ",
  }),
  tax_no: z.string({ message: "กรุณากรอกเลขประจำสิทธิ์ภาษี" }).min(1, {
    message: "กรุณากรอกเลขประจำสิทธิ์ภาษี",
  }),
  package_id: z.string({ message: "กรุณากรอกรหัสกลุ่มบริการ" }).min(1, {
    message: "กรุณากรอกรหัสกลุ่มบริการ",
  }),
  subscription_id: z.number({ message: "กรุณากรอกรหัสการสมัครสมาชิก" }).min(1, {
    message: "กรุณากรอกรหัสการสมัครสมาชิก",
  }),
  profile_image_url: z
    .string({ message: "กรุณากรอกลิงค์รูปภาพประจำตัว" })
    .optional(),
  company_type_id: CompanyTypeSchema.shape.id,
  points: z.number().default(0).optional(),
});

export type Company = z.infer<typeof CompanySchema>;
export type CompanyType = z.infer<typeof CompanyTypeSchema>;
