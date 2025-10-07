import { Company } from "../schemas/company.schema";

export function getCompanyCurrentPoints(
  companyInfo: Company | null | undefined
): number {
  return companyInfo?.points ?? 0;
}
