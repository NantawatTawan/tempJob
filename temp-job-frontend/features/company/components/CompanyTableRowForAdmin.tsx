import { formatThaiDate } from "@/lib/helpers/date.helper";
import { Dispatch, SetStateAction } from "react";
import { CompanyInfoForAdmin } from "../schemas/company.schema";
import CompanySubscriptionStatus from "./CompanySubscriptionStatus";

interface ICompanyTableRowForAdminProps {
  company: CompanyInfoForAdmin;
  onSelectCompany: (company: CompanyInfoForAdmin) => void;
  onOpenSelectPackageForCompanyModal: () => void;
  onSetSelectedCompany: (company: CompanyInfoForAdmin) => void;
  onSetIsOpenSelectPackageForCompanyModal: (isOpen: boolean) => void;
  onSetIsOpenEditCompanyModal: Dispatch<SetStateAction<boolean>>;
}

const CompanyTableRowForAdmin = ({
  company,
  onSelectCompany,
  onSetSelectedCompany,
  onSetIsOpenSelectPackageForCompanyModal,
  onSetIsOpenEditCompanyModal,
}: ICompanyTableRowForAdminProps) => {
  const {
    company_name,
    company_email,
    expired_at,
    is_subscription_active,
    package_name,
  } = company;
  return (
    <tr>
      <td className="px-6 py-4 text-sm text-gray-900">{company_name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{company_email}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{package_name ?? "-"}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {expired_at ? formatThaiDate(expired_at) : "-"}
      </td>
      <td className="px-6 py-4 text-sm">
        <CompanySubscriptionStatus
          is_subscription_active={is_subscription_active}
        />
      </td>
      <td className="px-6 py-4 text-sm space-x-2 flex items-center">
        <button
          className="text-green-600 hover:text-green-800 flex items-center"
          onClick={() => {
            onSelectCompany(company);
            onSetIsOpenEditCompanyModal(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          แก้ไข
        </button>
        <button
          className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 flex items-center transition-colors duration-200"
          onClick={() => {
            onSetSelectedCompany(company);
            onSetIsOpenSelectPackageForCompanyModal(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          ซื้อแพ็กเกจ
        </button>
      </td>
    </tr>
  );
};

export default CompanyTableRowForAdmin;
