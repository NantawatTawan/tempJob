import { z } from "zod";

export enum USER_ROLES {
  ADMIN = "admin",
  USER = "user",
}

const USER_ID_LENGTH = 36;

export const UserInfoSchema = z.object({
  id: z
    .string({ message: "รหัสผู้ใช้งานต้องเป็นข้อมูลประเภท string" })
    .refine((id) => id.length === USER_ID_LENGTH, {
      message: `รหัสผู้ใช้งานต้องมี ${USER_ID_LENGTH} ตัวอักษร`,
    }),
  role: z.nativeEnum(USER_ROLES),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;
