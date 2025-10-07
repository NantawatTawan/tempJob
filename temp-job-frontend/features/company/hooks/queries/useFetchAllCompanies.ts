import { useQuery } from "@tanstack/react-query";
import { companyService } from "../../services/company.service";

export function useFetchAllCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const companies = await companyService.getAllCompanies();
      return companies;
    },
  });
}
