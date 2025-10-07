import { USER_ROLES, UserInfo } from "../models/user.model";

export function isUserAdmin(user: UserInfo): boolean {
  return user.role === USER_ROLES.ADMIN;
}
