import { jobTypeService } from "@/features/job-types/services/job-type.service";
import { JobTypeSchema } from "@/features/posted-jobs/schemas/posted-job.schema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = JobTypeSchema.omit({ id: true });

type FormFields = z.infer<typeof FormSchema>;

interface ICreateNewJobTypeFormProps {
  onRefresh: () => void;
}

const CreateNewJobTypeForm = ({ onRefresh }: ICreateNewJobTypeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormFields) => {
    try {
      const newJobType = await jobTypeService.createNewJobType(data);

      if (!newJobType) {
        throw new Error("ไม่สามารถสร้างประเภทงานได้");
      }

      showSuccessAlert("สร้างประเภทงานเรียบร้อย");

      reset();
      onRefresh();
    } catch (error: any) {
      showErrorAlert(error.message);
    }
  };

  return (
    <form
      id="job-type-form"
      className="w-1/3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อประเภทงาน
          </label>
          <Input
            {...register("title")}
            placeholder="ระบุชื่อประเภทงาน"
            error={errors.title?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รายละเอียด
          </label>
          <Textarea
            {...register("description")}
            placeholder="รายละเอียดประเภทงาน"
            error={errors.description?.message}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          เพิ่มประเภทงาน
        </Button>
      </div>
    </form>
  );
};

export default CreateNewJobTypeForm;
