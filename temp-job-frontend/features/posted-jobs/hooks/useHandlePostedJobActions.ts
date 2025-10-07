import {
  showConfirmationAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/shared/utils/swal.utils";
import { useState } from "react";
import { PostedJob } from "../schemas/posted-job.schema";
import { postedJobService } from "../services/posted-job.service";

interface IUseHandlePostedActionsProps {
  job: PostedJob;
  onRefresh: () => void;
  onFinishDelete: () => void;
}

export function useHandlePostedJobActions({
  job,
  onRefresh,
  onFinishDelete,
}: IUseHandlePostedActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteConfirm() {
    try {
      setIsDeleting(true);
      await postedJobService.deleteJob(job.id);

      showSuccessAlert("ลบประกาศงานเรียบร้อย");

      onRefresh();
    } catch (error: any) {
      showErrorAlert(error.message);
    } finally {
      setIsDeleting(false);
      onFinishDelete();
    }
  }

  async function handleDisableJob() {
    try {
      const { isConfirmed } = await showConfirmationAlert(
        "ยืนยันการปิดประกาศ",
        "คุณแน่ใจที่จะปิดประกาศงานนี้หรือไม่?"
      );

      if (!isConfirmed) return;

      await postedJobService.disableJob(job.id);

      showSuccessAlert("ปิดประกาศงานเรียบร้อย");

      onRefresh();
    } catch (error: any) {
      showErrorAlert(error.message);
    }
  }

  async function handleActivateJob() {
    try {
      const { isConfirmed } = await showConfirmationAlert(
        "ยืนยันการเปิดประกาศ",
        "คุณแน่ใจที่จะเปิดประกาศงานนี้หรือไม่?"
      );

      if (!isConfirmed) return;

      await postedJobService.activateJob(job.id);

      showSuccessAlert("เปิดประกาศงานเรียบร้อย");

      onRefresh();
    } catch (error: any) {
      showErrorAlert(error.message);
    }
  }

  return {
    isDeleting,
    handleDeleteConfirm,
    handleDisableJob,
    handleActivateJob,
  };
}
