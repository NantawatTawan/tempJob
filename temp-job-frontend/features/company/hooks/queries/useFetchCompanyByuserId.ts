import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { companyService } from "../../services/company.service";

export function useFetchCompanyByUserId({ id }: Pick<User, "id">) {
  return useQuery({
    queryKey: ["company", "user id", id],
    queryFn: async () => {
      return await companyService.getCompanyByUserId(id);
    },
    enabled: !!id,
    retry: false,
  });
}
