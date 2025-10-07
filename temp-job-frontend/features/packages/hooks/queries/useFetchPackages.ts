import { useQuery } from "@tanstack/react-query";
import { packageService } from "../../services/package.service";

export function useFetchPackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      return await packageService.getAllPackages();
    },
  });
}
