import { PackageSchema } from '@/features/packages/schemas/pacakge.schema';
import { z } from 'zod';

export const CompanyTypeSchema = z.object({
  id: z.number({ message: 'กรุณากรอกรหัสประเภทบริษัท' }),
  created_at: z.string().optional(),
  title: z.string().min(1, {
    message: 'กรุณากรอกชื่อประเภทบริษัท',
  }),
  description: z.string().optional(),
});

export const CompanySchema = z.object({
  id: z.string({ message: 'กรุณากรอกรหัสบริษัท' }),
  user_id: z.string({ message: 'กรุณากรอกรหัสผู้ใช้งาน' }),
  company_name: z.string({ message: 'กรุณากรอกชื่อบริษัท' }).min(1, {
    message: 'กรุณากรอกชื่อบริษัท',
  }),
  additional_info: z.string().nullable(),
  address: z.string({ message: 'กรุณากรอกที่อยู่บริษัท' }).min(1, {
    message: 'กรุณากรอกที่อยู่บริษัท',
  }),
  province: z.string({ message: 'กรุณากรอกจังหวัด' }).min(1, {
    message: 'กรุณากรอกจังหวัด',
  }),
  district: z.string({ message: 'กรุณากรอกอำเภอ' }).min(1, {
    message: 'กรุณากรอกอำเภอ',
  }),
  sub_district: z.string({ message: 'กรุณากรอกตำบล' }).min(1, {
    message: 'กรุณากรอกตำบล',
  }),
  zip_code: z
    .string({ message: 'กรุณากรอกรหัสไปรษณีย์' })
    .min(1, {
      message: 'กรุณากรอกรหัสไปรษณีย์',
    })
    .refine(
      (data) => {
        return /^\d+$/.test(data);
      },
      {
        message: 'รหัสไปรษณีย์ต้องเป็นตัวเลข',
      }
    ),
  company_contact_person_name: z
    .string({ message: 'กรุณากรอกชื่อผู้ติดต่อบริษัท' })
    .min(1, {
      message: 'กรุณากรอกชื่อผู้ติดต่อบริษัท',
    }),
  company_phone_number: z
    .string({ message: 'กรุณากรอกเบอร์โทรบริษัท' })
    .min(1, {
      message: 'กรุณากรอกเบอร์โทรบริษัท',
    })
    .refine(
      (data) => {
        return /^\d+$/.test(data);
      },
      {
        message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข',
      }
    ),
  company_email: z
    .string({ message: 'กรุณากรอกอีเมลบริษัท' })
    .email({ message: 'รูปแบบอีเมลไม่ถูกต้อง' }),
  transportation_guide: z
    .string({ message: 'กรุณากรอกข้อมูลการขนส่ง' })
    .nullable(),
  company_location_map_url: z
    .string({ message: 'กรุณากรอกลิงค์ที่พิมพ์แผนที่บริษัท' })
    .nullable()
    .refine(
      (url) => {
        if (!url) return true;

        return url.startsWith('https://');
      },
      {
        message: 'ลิงค์ต้องเริ่มต้นด้วย https://',
      }
    ),
  welfare: z.string({ message: 'กรุณากรอกข้อมูลสวัสดิการ' }).nullable(),
  tax_no: z.string({ message: 'กรุณากรอกเลขประจำสิทธิ์ภาษี' }).min(1, {
    message: 'กรุณากรอกเลขประจำสิทธิ์ภาษี',
  }),
  package_id: z
    .string({ message: 'กรุณากรอกรหัสกลุ่มบริการ' })
    .min(1, {
      message: 'กรุณากรอกรหัสกลุ่มบริการ',
    })
    .nullable()
    .optional(),
  subscription_id: z
    .string({ message: 'กรุณากรอกรหัสการสมัครสมาชิก' })
    .min(1, {
      message: 'กรุณากรอกรหัสการสมัครสมาชิก',
    })
    .nullable()
    .optional(),
  profile_image_url: z
    .string({ message: 'กรุณากรอกลิงค์รูปภาพบริษัท' })
    .optional(),
  company_type_id: CompanyTypeSchema.shape.id.optional(),
  points: z.number().optional().default(0),
  packages: PackageSchema.optional(),
});

export const CompanyInfoForAdminSchema = CompanySchema.extend({
  created_at: z.string().nullable(),
  expired_at: z.string().nullable(),
  is_subscription_active: z.boolean(),
  package_name: z.string().nullable(),
});

export type Company = z.infer<typeof CompanySchema>;
export type CompanyInfoForAdmin = z.infer<typeof CompanyInfoForAdminSchema>;
export type CompanyType = z.infer<typeof CompanyTypeSchema>;
