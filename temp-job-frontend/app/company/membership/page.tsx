'use client';
import { getCompanyCurrentPoints } from '@/features/company/helpers/company.helper';
import { MEMBERSHIP_TIERS } from '@/features/membership/constants/membership.constant';
import {
  getCurrentTier,
  getNextTier,
  getProgressPercentageToNextTier,
  getRemainingPointsFromNextTier,
} from '@/features/membership/helpers/membership.helper';
import { useAuthRequiredRoute } from '@/shared/components/routes/AuthRequiredRoute';

const CompanyMembershipPage = () => {
  const { companyInfo: company } = useAuthRequiredRoute();

  const currentPoints = getCompanyCurrentPoints(company);

  const currentTier = getCurrentTier(currentPoints);

  const nextTier = getNextTier(currentPoints);

  const remainingPoints = getRemainingPointsFromNextTier(currentPoints);

  const progressPercentage = getProgressPercentageToNextTier(currentPoints);

  return (
    <div id="membership-levels-page" className="bg-primary min-h-screen pt-24">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <section
          id="current-tier"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                ระดับ {currentTier.name}
              </h2>
              <p className="opacity-90">
                อีก {remainingPoints} แต้มเพื่อขึ้นระดับ{' '}
                {nextTier?.name || 'สูงสุดแล้ว'}
              </p>
              <p className="mt-2 font-semibold">
                คะแนนปัจจุบัน: {currentPoints} แต้ม
              </p>
            </div>
            <i className={`${currentTier.icon} text-4xl text-yellow-300`}></i>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-yellow-300 h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </section>
        <section id="membership-tiers" className="grid gap-6">
          {MEMBERSHIP_TIERS.map((tier) => (
            <div
              key={tier.id}
              id={tier.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <i className={`${tier.icon} text-2xl`}></i>
                  <h3 className="text-xl font-semibold text-emerald-900">
                    {tier.name}
                  </h3>
                </div>
                <p className="text-emerald-600">{tier.pointsRequired}+ แต้ม</p>
              </div>
              <ul className="space-y-2 text-emerald-700">
                {tier.benefits.map((benefit, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-check text-emerald-500 mr-2"></i>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default CompanyMembershipPage;
