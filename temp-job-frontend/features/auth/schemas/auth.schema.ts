import { z } from "zod";

export const CredentialsSchema = z.object({
  email: z
    .string({ message: "อีเมลจำเป็นต้องกรอก" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z
    .string({ required_error: "รหัสผ่านจำเป็นต้องกรอก" })
    .min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" }),
});

export type Credentials = z.infer<typeof CredentialsSchema>;
