"use client";

import { useUser } from "@/features/auth/hooks/useUser";
import { isUserAdmin } from "@/features/users/helpers/user.helper";
import { useFetchUserInfo } from "@/features/users/hooks/useFetchUserInfo";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect } from "react";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

interface AdminProtectedRouteContextType {
  isAdmin: boolean;
}

const AdminProtectedRouteContext =
  createContext<AdminProtectedRouteContextType | null>(null);

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { data: user, isFetching: isFetchingUser } = useUser();

  const router = useRouter();

  const { data: userInfo, isFetching: isFetchingUserInfo } = useFetchUserInfo(
    user?.id ?? ""
  );

  useEffect(() => {
    if (isFetchingUser || isFetchingUserInfo) return;

    if (!user || !userInfo) {
      router.push("/sign-in");
      return;
    }

    if (!isUserAdmin(userInfo)) {
      router.push("/");
      return;
    }
  }, [user, isFetchingUser, router, userInfo]);

  if (isFetchingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-emerald-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
          <p className="text-lg font-medium text-emerald-800">
            กำลังตรวจสอบสิทธิ์...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminProtectedRouteContext.Provider value={{ isAdmin: true }}>
      {children}
    </AdminProtectedRouteContext.Provider>
  );
};

export const useAdminRequiredRoute = () => {
  const context = useContext(AdminProtectedRouteContext);

  if (!context) {
    throw new Error(
      "useAdminRequiredRoute must be used within a AdminProtectedRoute"
    );
  }

  return context;
};
