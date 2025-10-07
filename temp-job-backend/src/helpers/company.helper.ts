import { Company } from "../models/company.model";

export function doesCompanyHaveSubscription(companyInfo: Company): boolean {
  return Boolean(companyInfo.subscription_id);
}
