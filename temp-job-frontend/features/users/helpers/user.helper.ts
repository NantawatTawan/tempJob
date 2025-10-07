import { USER_ROLES, UserInfo } from "../schemas/user.schema";

export function isUserAdmin(userInfo: UserInfo): boolean {
  return userInfo.role === USER_ROLES.ADMIN;
}
