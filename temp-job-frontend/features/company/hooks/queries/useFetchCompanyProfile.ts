import { useQuery } from "@tanstack/react-query";
import { companyService } from "../../services/company.service";

export function useFetchCompanyProfile(companyId: string) {
  return useQuery({
    queryKey: ["company-profile", companyId],
    queryFn: async () => {
      return await companyService.getCompanyLogoUrl(companyId);
    },
  });
}
