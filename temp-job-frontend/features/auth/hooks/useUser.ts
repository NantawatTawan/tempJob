import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      return user;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}
