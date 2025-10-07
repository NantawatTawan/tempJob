"use client";

import CompanyTableForAdmin from "@/features/company/components/CompanyTableForAdmin";

const AdminCompanyManagementPage = () => {
  return (
    <div className="flex-1">
      <div id="main-content" className="p-8">
        <section
          id="recent-companies"
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <CompanyTableForAdmin />
        </section>
      </div>
    </div>
  );
};

export default AdminCompanyManagementPage;
