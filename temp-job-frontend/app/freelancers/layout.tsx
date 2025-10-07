import { QueryProvider } from "@/shared/components/providers/QueryProvider";
import AuthRequiredRoute from "@/shared/components/routes/AuthRequiredRoute";
import React, { ReactNode } from "react";

export const metadata = {
  title: "ค้นหาผู้สมัครงาน | TempJob",
  description: "ค้นหาผู้สมัครงานฟรีแลนซ์ที่เหมาะกับงานของคุณ",
};

export default function FreelancersLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthRequiredRoute>{children}</AuthRequiredRoute>
    </QueryProvider>
  );
}
