import { UserInfoSchema } from "@/features/users/schemas/user.schema";
import { z } from "zod";

export const ThemeSchema = z.object({
  id: z.number(),
  name: z.string().min(5, { message: "ชื่อธีมต้องมีอย่างน้อย 5 ตัวอักษร" }),
  price: z
    .number({ message: "กรุณากรอกราคา" })
    .min(0, { message: "ราคาต้องมีค่ามากกว่า 0" }),
  description: z
    .string()
    .min(1, { message: "รายละเอียดต้องมีอย่างน้อย 1 ตัวอักษร" }),
  created_at: z.string(),
  updated_at: z.string(),
  updated_by_user_id: UserInfoSchema.shape.id.optional(),
  image_url: z.string().nullable(),
  is_active: z.boolean(),
});

export type Theme = z.infer<typeof ThemeSchema>;
