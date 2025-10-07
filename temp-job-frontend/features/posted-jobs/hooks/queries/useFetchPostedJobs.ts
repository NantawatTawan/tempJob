import { useQuery } from "@tanstack/react-query";
import { postedJobService } from "../../services/posted-job.service";

export function useFetchPostedJobs() {
  return useQuery({
    queryKey: ["posted-jobs"],
    queryFn: async () => {
      const postedJobs = await postedJobService.getPostedJobsWithViewsAndApplications();
      return postedJobs;
    },
  });
}
