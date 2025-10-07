import EditCompanyTypeModal from "@/features/company/components/EditCompanyTypeModal";
import { useFetchAllCompanyTypes } from "@/features/company/hooks/queries/useFetchAllCompanyTypes";
import { CompanyType } from "@/features/company/schemas/company.schema";
import { companyService } from "@/features/company/services/company.service";
import { Button } from "@/shared/components/ui/button";
import { useModal } from "@/shared/hooks/useModal";
import {
  showConfirmationAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/shared/utils/swal.utils";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import CreateCompanyTypeForm from "./CreateCompanyTypeForm";
import LoadingPlaceholder from "./LoadingPlaceholder";

const ManageCompanyTypeSection = () => {
  const {
    data: companyTypes,
    isFetching: isFetchingCompanyTypes,
    refetch,
  } = useFetchAllCompanyTypes();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedCompanyType, setSelectedCompanyType] =
    useState<CompanyType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useModal();

  const paginatedCompanyTypes = companyTypes
    ? companyTypes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const totalPages = companyTypes
    ? Math.ceil(companyTypes.length / itemsPerPage)
    : 0;

  if (isFetchingCompanyTypes) {
    return <LoadingPlaceholder title="จัดการประเภทธุรกิจ" />;
  }

  const handleEdit = (companyType: CompanyType) => {
    setSelectedCompanyType(companyType);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    showConfirmationAlert(
      "ยืนยันการลบ",
      "คุณต้องการลบประเภทธุรกิจนี้ใช่หรือไม่?"
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsDeleting(true);
          await companyService.deleteCompanyType(id);
          showSuccessAlert("ลบประเภทธุรกิจเรียบร้อย");
          refetch();
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
          onSuccess={refetch}
          companyType={selectedCompanyType}
        />
      )}

      <section
        id="company-type-management"
        className="bg-white rounded-lg shadow-sm p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-6 text-green-800">
          จัดการประเภทธุรกิจ
        </h2>
        <div className="flex gap-6">
          <CreateCompanyTypeForm onRefresh={refetch} />
          <div id="company-type-list" className="w-2/3">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-4 py-2 text-left">ชื่อประเภทธุรกิจ</th>
                  <th className="px-4 py-2 text-left">รายละเอียด</th>
                  <th className="px-4 py-2 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedCompanyTypes?.length > 0 ? (
                  paginatedCompanyTypes.map((companyType) => (
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
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-center text-gray-500"
                    >
                      ไม่พบข้อมูลประเภทธุรกิจ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className={`text-sm text-green-600 ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  ← ก่อนหน้า
                </button>

                <div className="text-sm text-gray-500">
                  หน้า {currentPage} จาก {totalPages}
                </div>

                <button
                  className={`text-sm text-green-600 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  ถัดไป →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ManageCompanyTypeSection;
