import { z } from "zod";
import { UserInfoSchema } from "./user.model";
import { Freelancer } from "./freelancer.model";

export const ThemeSchema = z.object({
  id: z.number({ message: "รหัสธีมต้องเป็นตัวเลข" }).optional(),
  name: z
    .string({ message: "ชื่อธีมต้องเป็นข้อความ" })
    .min(5, {
      message: "ชื่อธีมต้องมีอย่างน้อย 5 ตัวอักษร",
    })
    .optional(),
  price: z
    .number({ message: "กรุณากรอกราคา" })
    .min(0, { message: "ราคาต้องมีค่ามากกว่า 0" })
    .optional(),
  description: z
    .string({ message: "รายละเอียดต้องเป็นข้อความ" })
    .min(1, { message: "รายละเอียดต้องมีอย่างน้อย 1 ตัวอักษร" })
    .optional(),
  created_at: z.string({ message: "วันที่สร้างต้องเป็นวันที่" }).optional(),
  updated_at: z.string({ message: "วันที่อัพเดตต้องเป็นวันที่" }).optional(),
  updated_by_user_id: UserInfoSchema.shape.id.optional(),
  image_url: z.string({ message: "รูปภาพต้องเป็น URL" }).optional(),
  is_active: z.boolean({ message: "สถานะต้องเป็นค่าตรรกะ" }).optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;

export type ThemePurchase = {
  id: number;
  freelancer_id: Freelancer["id"];
  theme_id: Theme["id"];
  created_at: string;
  freelancer: Freelancer;
  theme: Theme;
};
