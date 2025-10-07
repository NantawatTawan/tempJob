import { USER_ROLES, UserInfo } from "../models/user.model";

export function isUserAdmin(user: UserInfo): boolean {
  return user.role === USER_ROLES.ADMIN;
}

export function formatUserInfo(userInfo: any): UserInfo {
  return {
    ...userInfo,
    role:
      userInfo.company && userInfo.company.length > 0
        ? "COMPANY"
        : "FREELANCER",
  };
}
