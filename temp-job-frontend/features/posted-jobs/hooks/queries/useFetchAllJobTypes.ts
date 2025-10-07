import { postedJobService } from "@/features/posted-jobs/services/posted-job.service";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllJobTypes() {
  return useQuery({
    queryKey: ["job-types"],
    queryFn: async () => await postedJobService.getAllJobTypes(),
  });
}
