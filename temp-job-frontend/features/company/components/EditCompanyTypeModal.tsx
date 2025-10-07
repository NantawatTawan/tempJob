import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CompanyType } from "../schemas/company.schema";
import { companyService } from "../services/company.service";

interface IEditCompanyTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyType: CompanyType;
}

const FormSchema = z.object({
  title: z.string().min(1, { message: "กรุณากรอกชื่อประเภทธุรกิจ" }),
  description: z.string().optional(),
});

type FormFields = z.infer<typeof FormSchema>;

const EditCompanyTypeModal = ({
  isOpen,
  onClose,
  onSuccess,
  companyType,
}: IEditCompanyTypeModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: companyType.title,
      description: companyType.description || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: companyType.title,
        description: companyType.description || "",
      });
    }
  }, [isOpen, companyType, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormFields) => {
    try {
      setIsSubmitting(true);
      await companyService.updateCompanyType(companyType.id, {
        ...data,
        id: companyType.id,
      });

      showSuccessAlert("แก้ไขประเภทธุรกิจเรียบร้อย");

      onSuccess();
      handleClose();
    } catch (error: any) {
      showErrorAlert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขประเภทธุรกิจ</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Input
            label="ชื่อประเภทธุรกิจ"
            placeholder="ระบุชื่อประเภทธุรกิจ"
            error={errors.title?.message}
            {...register("title")}
          />

          <Textarea
            label="รายละเอียด"
            placeholder="รายละเอียดประเภทธุรกิจ"
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              บันทึกการแก้ไข
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyTypeModal;
