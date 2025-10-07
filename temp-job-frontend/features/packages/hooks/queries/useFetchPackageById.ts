import { useQuery } from "@tanstack/react-query";
import { packageService } from "../../services/package.service";
import { Package } from "../../schemas/pacakge.schema";

export function useFetchPackageById(packageId: Package["id"]) {
  return useQuery({
    queryKey: ["package", packageId],
    queryFn: async () => {
      return await packageService.getPackageById(packageId);
    },
    enabled: Boolean(packageId),
  });
}
