"use client";

import AuthRequiredRoute from "@/shared/components/routes/AuthRequiredRoute";
import React, { ReactNode } from "react";

interface CompanyProfileLayoutProps {
  children: ReactNode;
}

const CompanyProfileLayout = ({ children }: CompanyProfileLayoutProps) => {
  return <AuthRequiredRoute>{children}</AuthRequiredRoute>;
};

export default CompanyProfileLayout;
