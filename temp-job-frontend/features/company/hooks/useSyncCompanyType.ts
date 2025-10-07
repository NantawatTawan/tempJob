import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Company, CompanyType } from "../schemas/company.schema";

export function useSyncCompanyType(
  valueSetter: UseFormSetValue<any>,
  companyTypes: CompanyType[],
  companyInfo: Company
) {
  useEffect(() => {
    if (companyTypes) {
      valueSetter("company_type_id", companyInfo.company_type_id);
    }
  }, [companyTypes, companyInfo]);
}
