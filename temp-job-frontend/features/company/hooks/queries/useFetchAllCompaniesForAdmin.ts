import { useQuery } from "@tanstack/react-query";
import { companyService } from "../../services/company.service";

export const useFetchAllCompaniesForAdmin = () => {
  return useQuery({
    queryKey: ["companies-for-admin"],
    queryFn: async () => {
      const companiesForAdmin = await companyService.getAllCompaniesForAdmin();
      return companiesForAdmin;
    },
  });
};
