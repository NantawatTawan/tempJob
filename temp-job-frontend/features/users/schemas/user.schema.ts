import { z } from "zod";

export enum USER_ROLES {
  ADMIN = "admin",
  USER = "user",
}

export const UserInfoSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(USER_ROLES),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;
