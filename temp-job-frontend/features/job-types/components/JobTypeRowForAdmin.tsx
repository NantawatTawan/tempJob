import { useModal } from "@/shared/hooks/useModal";
import {
  showConfirmationAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/shared/utils/swal.utils";
import { Pencil, Trash2 } from "lucide-react";
import { JobType } from "../../posted-jobs/schemas/posted-job.schema";
import { jobTypeService } from "../services/job-type.service";
import EditJobTypeModalForAdmin from "./EditJobTypeModalForAdmin";
interface IJobTypeRowForAdminProps {
  jobType: JobType;
  onRefresh: () => void;
}

const JobTypeRowForAdmin = ({
  jobType,
  onRefresh,
}: IJobTypeRowForAdminProps) => {
  const { title, description } = jobType;
  const {
    isOpen: isEditJobTypeModalOpen,
    onOpen: onEditJobTypeModalOpen,
    onClose: onEditJobTypeModalClose,
  } = useModal();

  async function handleDeleteJobType() {
    try {
      const { isConfirmed } = await showConfirmationAlert(
        "ยืนยันการลบประเภทงาน",
        "คุณแน่ใจที่จะลบประเภทงานนี้หรือไม่?"
      );

      if (!isConfirmed) {
        return;
      }

      await jobTypeService.deleteJobTypeById(jobType.id);

      showSuccessAlert("ลบประเภทงานเรียบร้อย");

      onRefresh();
    } catch (error: any) {
      showErrorAlert(error.message);
    }
  }
  return (
    <>
      {isEditJobTypeModalOpen && (
        <EditJobTypeModalForAdmin
          jobType={jobType}
          onRefresh={onRefresh}
          onClose={onEditJobTypeModalClose}
          isOpen={isEditJobTypeModalOpen}
        />
      )}
      <tr>
        <td className="px-4 py-3">{title}</td>
        <td className="px-4 py-3">{description ?? "ไม่มีรายละเอียด"}</td>
        <td className="px-4 py-3 text-center">
          <button className="text-green-600 hover:text-green-800 mx-1">
            <Pencil size={16} onClick={onEditJobTypeModalOpen} />
          </button>
          <button
            onClick={handleDeleteJobType}
            className="text-red-600 hover:text-red-800 mx-1"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    </>
  );
};

export default JobTypeRowForAdmin;
