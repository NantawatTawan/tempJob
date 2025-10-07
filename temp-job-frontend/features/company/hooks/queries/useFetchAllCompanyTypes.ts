import { useQuery } from "@tanstack/react-query";
import { companyService } from "../../services/company.service";

export function useFetchAllCompanyTypes() {
  return useQuery({
    queryKey: ["company-types"],
    queryFn: async () => {
      return await companyService.getAllCompanyTypes();
    },
  });
}
