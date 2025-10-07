import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export function useFetchUserInfo(userId: string) {
  return useQuery({
    queryKey: ["user-info", userId],
    queryFn: async () => {
      const userInfo = await userService.getUserInfo(userId);
      return userInfo;
    },
    enabled: Boolean(userId),
  });
}
