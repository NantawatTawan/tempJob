import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EducationMajorSchema } from "../schemas/education-major.schema";
import { educationMajorService } from "../services/education-major.service";

const FormSchema = EducationMajorSchema.omit({ id: true });

type FormFields = z.infer<typeof FormSchema>;

interface ICreateEducationMajorFormProps {
  onRefresh: () => void;
}

const CreateEducationMajorForm = ({
  onRefresh,
}: ICreateEducationMajorFormProps) => {
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

  async function onSubmit(data: FormFields) {
    try {
      await educationMajorService.createEducationMajor(data);

      showSuccessAlert("สร้างสาขาวิชาเรียบร้อย");

      onRefresh();

      reset();
    } catch (error: any) {
      showErrorAlert(error.message);
    }
  }
  return (
    <form id="major-form" className="w-1/3" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Input
          {...register("title")}
          placeholder="ระบุชื่อสาขาวิชา"
          className="w-full"
          label="ชื่อสาขาวิชา"
          error={errors.title?.message}
        />
        <Textarea
          {...register("description")}
          placeholder="รายละเอียดสาขาวิชา"
          className="w-full"
          label="รายละเอียด"
          error={errors.description?.message}
        />

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          เพิ่มสาขาวิชา
        </Button>
      </div>
    </form>
  );
};

export default CreateEducationMajorForm;
