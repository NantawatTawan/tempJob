'use client';

import { ReactNode, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/features/auth/hooks/useUser';
import { User } from '@supabase/supabase-js';
import { useFetchSubscriptionById } from '@/features/subscription/hooks/queries/useFetchSubscriptionById';
import { useFetchCompanyByUserId } from '@/features/company/hooks/queries/useFetchCompanyByuserId';
import { Company } from '@/features/company/schemas/company.schema';
import { Subscription } from '@/features/subscription/schemas/subscription.schema';
import { hasSubscriptionExpired } from '@/features/subscription/helpers/subscription.helper';
import { showErrorAlert } from '@/shared/utils/swal.utils';

interface IAuthRequiredRouteContext {
  user: User;
  companyInfo: Company;
  subscription: Subscription;
}

const AuthRequiredRouteContext =
  createContext<IAuthRequiredRouteContext | null>(null);

export const useAuthRequiredRoute = () => {
  const context = useContext<IAuthRequiredRouteContext | null>(
    AuthRequiredRouteContext
  );
  if (context === undefined || !context) {
    throw new Error(
      'useAuthRequiredRoute must be used within an AuthRequiredRoute'
    );
  }
  return context;
};

interface AuthRequiredRouteProps {
  children: ReactNode;
}

export default function AuthRequiredRoute({
  children,
}: AuthRequiredRouteProps) {
  const router = useRouter();

  const { data: user, isFetching: isFetchingUser } = useUser();

  const { data: company, isFetching: isFetchingCompany } =
    useFetchCompanyByUserId({ id: user?.id ?? '' });

  const { data: subscription, isFetching: isFetchingSubscription } =
    useFetchSubscriptionById(parseInt(company?.subscription_id ?? '0'));

  useEffect(() => {
    if (isFetchingUser || isFetchingCompany || isFetchingSubscription) return;

    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (!subscription) {
      showErrorAlert('ไม่พบแพคเก็จของคุณ กรุณาติดต่อผู้ดูแลระบบ');
      router.push('/contact');
      return;
    }

    // if (hasSubscriptionExpired(subscription)) {
    //   showErrorAlert("แพคเก็จของคุณหมดอายุ กรุณาติดต่อผู้ดูแลระบบ");
    //   router.push("/contact");
    // }
  }, [
    user?.id,
    isFetchingUser,
    isFetchingCompany,
    isFetchingSubscription,
    subscription?.id,
    company?.id,
  ]);

  if (isFetchingUser || isFetchingCompany || isFetchingSubscription) {
    return (
      <div className="container mx-auto py-6 px-4">
        กำลังโหลดข้อมูลผู้ใช้งาน...
      </div>
    );
  }

  if (!user || !company || !subscription) {
    return null;
  }

  return (
    <AuthRequiredRouteContext.Provider
      value={{
        user,
        companyInfo: company,
        subscription,
      }}
    >
      {children}
    </AuthRequiredRouteContext.Provider>
  );
}
