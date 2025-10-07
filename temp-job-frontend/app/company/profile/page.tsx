"use client";
import EditCompanyProfileForm from "@/features/company/components/EditCompanyProfileForm";
import { useAuthRequiredRoute } from "@/shared/components/routes/AuthRequiredRoute";

const CompanyProfilePage = () => {
  const { companyInfo } = useAuthRequiredRoute();

  if (!companyInfo) {
    return (
      <div className="bg-primary min-h-screen pt-24 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">
            ไม่พบข้อมูลบริษัท
          </h2>
          <p className="text-gray-600 mb-6">
            กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มข้อมูลบริษัทของคุณ
          </p>
        </div>
      </div>
    );
  }

  return <EditCompanyProfileForm companyInfo={companyInfo} />;
};

export default CompanyProfilePage;
