import { Button } from "@/shared/components/ui/button";
import { useModal } from "@/shared/hooks/useModal";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { CompanyType } from "../schemas/company.schema";
import { companyService } from "../services/company.service";
import EditCompanyTypeModal from "./EditCompanyTypeModal";
import {
  showConfirmationAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/shared/utils/swal.utils";

interface ICompanyTypeListForAdminProps {
  companyTypes: CompanyType[];
  onRefresh: () => void;
}

const CompanyTypeListForAdmin = ({
  companyTypes,
  onRefresh,
}: ICompanyTypeListForAdminProps) => {
  const { isOpen, onOpen, onClose } = useModal();
  const [selectedCompanyType, setSelectedCompanyType] =
    useState<CompanyType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (companyType: CompanyType) => {
    setSelectedCompanyType(companyType);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    showConfirmationAlert(
      "ยืนยันการลบ",
      "คุณต้องการลบประเภทธุรกิ  จนี้ใช่หรือไม่?"
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsDeleting(true);
          await companyService.deleteCompanyType(id);
          showSuccessAlert("ลบประเภทธุรกิจเรียบร้อย");
          onRefresh();
        } catch (error: any) {
          showErrorAlert(error.message);
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  return (
    <>
      {selectedCompanyType && (
        <EditCompanyTypeModal
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={onRefresh}
          companyType={selectedCompanyType}
        />
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                ชื่อประเภทธุรกิจ
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                รายละเอียด
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 w-24">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companyTypes?.length > 0 ? (
              companyTypes.map((companyType) => (
                <tr key={companyType.id}>
                  <td className="px-4 py-3">{companyType.title}</td>
                  <td className="px-4 py-3">{companyType.description}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(companyType)}
                      className="text-green-600 hover:text-green-800 hover:bg-green-50"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(companyType.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                  ไม่พบข้อมูลประเภทธุรกิจ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CompanyTypeListForAdmin;
