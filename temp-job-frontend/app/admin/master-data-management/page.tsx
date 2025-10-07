"use client";
import ManageCompanyTypeSection from "./_components/ManageCompanyTypeSection";
import ManageEducationMajorSection from "./_components/ManageEducationMajorSection";
import ManageJobTypeSection from "./_components/ManageJobTypeSection";

const AdminMasterDataManagementPage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div id="main-content" className="p-8">
          <ManageEducationMajorSection />
          <ManageJobTypeSection />
          <ManageCompanyTypeSection />
        </div>
      </div>
    </div>
  );
};

export default AdminMasterDataManagementPage;
