import { educationMajorService } from "@/features/education-major/services/education-major.service";
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
import {
  EducationMajor,
  EducationMajorSchema,
} from "../schemas/education-major.schema";

interface IEditEducationMajorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  educationMajor: EducationMajor;
}

const FormSchema = EducationMajorSchema.omit({ id: true });

type FormFields = z.infer<typeof FormSchema>;

const EditEducationMajorModal = ({
  isOpen,
  onClose,
  onSuccess,
  educationMajor,
}: IEditEducationMajorModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (educationMajor) {
      setValue("title", educationMajor.title);
      setValue("description", educationMajor.description || "");
    }
  }, [educationMajor, setValue]);

  const onSubmit = async (data: FormFields) => {
    try {
      setIsSubmitting(true);
      await educationMajorService.updateEducationMajor(educationMajor.id, data);

      showSuccessAlert("แก้ไขสาขาวิชาเรียบร้อยแล้ว");

      reset();
      onClose();
      onSuccess();
    } catch (error: any) {
      showErrorAlert(
        error.message || "ไม่สามารถแก้ไขสาขาวิชาได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-800">
            แก้ไขสาขาวิชา
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Input
            label="ชื่อสาขาวิชา"
            placeholder="ระบุชื่อสาขาวิชา"
            error={errors.title?.message}
            {...register("title")}
          />

          <Textarea
            label="รายละเอียด"
            placeholder="รายละเอียดสาขาวิชา"
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

export default EditEducationMajorModal;
