import { useQuery } from "@tanstack/react-query";
import { postedJobService } from "../../services/posted-job.service";
import { JobType } from "../../schemas/posted-job.schema";

export function useFetchJobTypeById(jobTypeId: JobType["id"]) {
  return useQuery({
    queryKey: ["job-type", jobTypeId],
    queryFn: async () => await postedJobService.getJobTypeById(jobTypeId),
    enabled: Boolean(jobTypeId),
  });
}
