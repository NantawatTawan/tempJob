"use client";

import AuthRequiredRoute from "@/shared/components/routes/AuthRequiredRoute";
import { ReactNode } from "react";

interface IPostedJobsLayoutProps {
  children: ReactNode;
}

export default function PostedJobsLayout({ children }: IPostedJobsLayoutProps) {
  return (
    <AuthRequiredRoute>
      <div className="w-full mx-auto min-h-screen">{children}</div>
    </AuthRequiredRoute>
  );
}
