import { provinceService } from "@/features/provinces/services/province.service";
import { Province } from "@/features/provinces/schemas/province.schema";
import { useEffect, useMemo, useState } from "react";

export function useProvinces(
  selectedProvince: string,
  selectedAmphure: string
) {
  const [fetchedProvinces, setFetchedProvcines] = useState<Province[]>([]);

  useEffect(() => {
    (async () => {
      const provinces = await provinceService.getAllProvinces();
      setFetchedProvcines(provinces);
    })();
  }, []);

  const currentProvince = useMemo(() => {
    return fetchedProvinces
      ? fetchedProvinces?.find((p) => p.name_th === selectedProvince)
      : null;
  }, [fetchedProvinces, selectedProvince]);

  const currentAmphure = useMemo(() => {
    console.log('currentProvince', currentProvince);
    return currentProvince
      ? currentProvince?.amphure?.find((a) => a.name_th === selectedAmphure)
      : null;
  }, [currentProvince, selectedAmphure]);

  const provinces = useMemo(() => {
    if (!fetchedProvinces) return null;

    return fetchedProvinces.map((province: Province) => ({
      key: province.name_th,
      value: province.name_th,
    }));
    
  }, [fetchedProvinces]);

  const amphures = useMemo(() => {
    if (!selectedProvince || !fetchedProvinces || !currentProvince) return null;

    return currentProvince.amphure?.map((a) => ({
      key: a.name_th,
      value: a.name_th,
    }));
  }, [selectedProvince, fetchedProvinces]);

  const tambons = useMemo(() => {
    if (
      !selectedAmphure ||
      !fetchedProvinces ||
      !currentProvince ||
      !currentAmphure
    )
      return null;

    return currentAmphure.tambon?.map((t) => ({
      key: t.name_th,
      value: t.name_th,
    }));
  }, [selectedAmphure, fetchedProvinces]);

  return { provinces, amphures, tambons };
}
