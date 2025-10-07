import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  JobType,
  JobTypeSchema,
} from "../../posted-jobs/schemas/posted-job.schema";
import { jobTypeService } from "../services/job-type.service";
interface IEditJobTypeModalForAdminProps {
  jobType: JobType;
  onRefresh: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const FormSchema = JobTypeSchema.omit({ id: true });

type FormFields = z.infer<typeof FormSchema>;

const EditJobTypeModalForAdmin = ({
  jobType,
  onRefresh,
  onClose,
  isOpen,
}: IEditJobTypeModalForAdminProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      title: jobType.title,
      description: jobType.description,
    },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: FormFields) => {
    try {
      await jobTypeService.updateJobTypeById(jobType.id, data);

      showSuccessAlert("แก้ไขประเภทงานเรียบร้อย");

      onRefresh();

      onClose();
    } catch (error: any) {
      showErrorAlert(error.message || "ไม่สามารถแก้ไขประเภทงานได้");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger>
        <Pencil size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขประเภทงาน</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            {...register("title")}
            label="ชื่อประเภทงาน"
            placeholder="ระบุชื่อประเภทงาน"
            error={errors.title?.message}
          />
          <Textarea
            {...register("description")}
            label="รายละเอียด"
            placeholder="ระบุรายละเอียดประเภทงาน"
            error={errors.description?.message}
          />
          <footer className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button type="submit">แก้ไข</Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobTypeModalForAdmin;
