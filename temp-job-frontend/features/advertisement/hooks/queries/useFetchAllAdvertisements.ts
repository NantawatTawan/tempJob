import { useQuery } from "@tanstack/react-query";
import { advertisementService } from "../../services/advertisement.service";

export function useFetchAllAdvertisements() {
  return useQuery({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const advertisements = await advertisementService.getAllAdvertisements();
      return advertisements;
    },
  });
}
