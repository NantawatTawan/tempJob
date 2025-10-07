import { useEffect } from "react";
import { Company } from "../schemas/company.schema";

export function useSyncCompanyProfileImage(
  onSetCurrentImageUrl: (url: string | null) => void,
  onSetPreviewUrl: (url: string | null) => void,
  companyInfo: Company
) {
  useEffect(() => {
    if (!companyInfo) return;

    onSetCurrentImageUrl(companyInfo?.profile_image_url ?? null);

    onSetPreviewUrl(companyInfo?.profile_image_url ?? null);
  }, [companyInfo]);
}
