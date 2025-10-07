import { useQuery } from "@tanstack/react-query";
import { postedJobService } from "../../services/posted-job.service";

export function useFetchPostedJobById(jobId: string) {
  return useQuery({
    queryKey: ["posted-job", jobId],
    queryFn: async () =>
      await postedJobService.getPostedJobsWithViewsAndApplicationsByJobId(
        jobId
      ),
    enabled: Boolean(jobId),
  });
}
