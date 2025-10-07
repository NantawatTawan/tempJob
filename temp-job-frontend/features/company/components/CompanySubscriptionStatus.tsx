import { cn } from "@/lib/utils";
import React from "react";

interface ICompanySubscriptionStatusProps {
  is_subscription_active: boolean;
}

const CompanySubscriptionStatus = ({
  is_subscription_active,
}: ICompanySubscriptionStatusProps) => {
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-full",
        is_subscription_active
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      )}
    >
      {is_subscription_active ? "Active" : "Inactive"}
    </span>
  );
};

export default CompanySubscriptionStatus;
