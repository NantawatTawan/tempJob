import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";

export function useSyncForm(
  toSyncInfo: Record<any, any> | null | undefined,
  formSetter: UseFormSetValue<any>
) {
  useEffect(() => {
    if (!toSyncInfo) return;

    Object.keys(toSyncInfo).forEach((key) => {
      formSetter(key, toSyncInfo[key]);
    });
  }, [JSON.stringify(toSyncInfo)]);
}
