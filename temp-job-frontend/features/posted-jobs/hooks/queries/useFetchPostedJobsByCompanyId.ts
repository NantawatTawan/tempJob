import { Company } from "@/features/company/schemas/company.schema";
import { postedJobService } from "../../services/posted-job.service";
import { useQuery } from "@tanstack/react-query";

export function useFetchPostedJobsByCompanyId(companyId: Company["id"]) {
  return useQuery({
    queryKey: ["posted-jobs", companyId],
    queryFn: async () => {
      return await postedJobService.getPostedJobsByCompanyId(companyId);
    },
    enabled: Boolean(companyId),
  });
}
