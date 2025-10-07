import { companyService } from "@/features/company/services/company.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  title: z.string().min(1, { message: "กรุณากรอกชื่อประเภทธุรกิจ" }),
  description: z.string().optional(),
});

type FormFields = z.infer<typeof FormSchema>;

interface ICreateCompanyTypeFormProps {
  onRefresh: () => void;
}

const CreateCompanyTypeForm = ({ onRefresh }: ICreateCompanyTypeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: FormFields) => {
    try {
      setIsSubmitting(true);
      await companyService.createCompanyType(data);

      showSuccessAlert("สร้างประเภทธุรกิจสำเร็จ");

      reset();
      onRefresh();
    } catch (error: any) {
      showErrorAlert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-1/3">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="ชื่อประเภทธุรกิจ"
          placeholder="ระบุชื่อประเภทธุรกิจ"
          error={errors.title?.message}
          {...register("title")}
        />

        <Textarea
          label="รายละเอียด (ถ้ามี)"
          placeholder="รายละเอียดประเภทธุรกิจ"
          error={errors.description?.message}
          {...register("description")}
        />

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          เพิ่มประเภทธุรกิจ
        </Button>
      </form>
    </div>
  );
};

export default CreateCompanyTypeForm;
