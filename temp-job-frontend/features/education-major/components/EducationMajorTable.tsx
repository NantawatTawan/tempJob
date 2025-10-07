import { educationMajorService } from "@/features/education-major/services/education-major.service";
import { Button } from "@/shared/components/ui/button";
import { useModal } from "@/shared/hooks/useModal";
import {
  showConfirmationAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/shared/utils/swal.utils";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { EducationMajor } from "../schemas/education-major.schema";
import EditEducationMajorModal from "./EditEducationMajorModal";

interface IEducationMajorTableProps {
  educationMajors: EducationMajor[];
  onRefresh: () => void;
}

const EducationMajorTable = ({
  educationMajors,
  onRefresh,
}: IEducationMajorTableProps) => {
  const { isOpen, onOpen, onClose } = useModal();
  const [selectedMajor, setSelectedMajor] = useState<EducationMajor | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (educationMajor: EducationMajor) => {
    setSelectedMajor(educationMajor);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    showConfirmationAlert(
      "ยืนยันการลบ",
      "คุณต้องการลบสาขาวิชาใช่หรือไม่?"
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsDeleting(true);
          await educationMajorService.deleteEducationMajor(id);
          showSuccessAlert("ลบสาขาวิชาเรียบร้อยแล้ว");
          onRefresh();
        } catch (error: any) {
          showErrorAlert(error.message || "ไม่สามารถลบสาขาวิชาได้");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  return (
    <>
      {selectedMajor && (
        <EditEducationMajorModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedMajor(null);
          }}
          onSuccess={onRefresh}
          educationMajor={selectedMajor}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-2 text-left">สาขาวิชา</th>
              <th className="px-4 py-2 text-left">รายละเอียด</th>
              <th className="px-4 py-2 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {educationMajors?.length > 0 ? (
              educationMajors.map((educationMajor) => (
                <tr key={educationMajor.id}>
                  <td className="px-4 py-3">{educationMajor.title}</td>
                  <td className="px-4 py-3">{educationMajor.description}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(educationMajor)}
                      className="text-green-600 hover:text-green-800 hover:bg-green-50"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(educationMajor.id)}
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
                  ไม่พบข้อมูลสาขาวิชา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EducationMajorTable;
