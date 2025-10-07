"use client";
import { ThemeSchema } from "@/features/theme/schemas/theme.schema";
import { Button } from "@/shared/components/ui/button";
import { FileUpload } from "@/shared/components/ui/file-upload";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useFileUpload } from "@/shared/hooks/useFileUpload";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { themeService } from "../services/theme.service";
const FormSchema = ThemeSchema.pick({
  name: true,
  price: true,
  description: true,
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface ICreateThemeFormProps {
  onRefresh: () => void;
}

const CreateThemeForm = ({ onRefresh }: ICreateThemeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    },
  });

  const {
    file: themeFile,
    previewUrl,
    currentUrl,
    fileInputRef,
    fileInputKey,
    handleFileChange,
    handleRemoveFile,
    onResetFileInput,
  } = useFileUpload({
    maxSizeMB: 5,
    acceptedFileTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  });

  const onSubmit = async (data: FormSchemaType) => {
    try {
      if (!themeFile) {
        showErrorAlert("กรุณาอัพโหลดรูปภาพธีม");

        return;
      }

      const createdTheme = await themeService.createNewTheme(data);

      if (!createdTheme) {
        showErrorAlert("ไม่สามารถสร้างธีมได้");

        return;
      }

      try {
        const imagePath = await themeService.uploadThemeImage(
          createdTheme.id,
          themeFile
        );

        const imageUrl = themeService.getImagePublicUrl(imagePath);

        await themeService.updateTheme(createdTheme.id, {
          image_url: imageUrl,
        });

        showSuccessAlert("สร้างธีมเรียบร้อย");

        reset();
      } catch (error: any) {
        await themeService.deleteThemeByThemeId(createdTheme.id);

        showErrorAlert(error.message);
      }
    } catch (error: any) {
      showErrorAlert(error.message);
    } finally {
      onRefresh();
      onResetFileInput();
      reset();
    }
  };

  return (
    <form
      id="theme-management"
      className="bg-white rounded-lg shadow-sm p-6 mb-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-semibold mb-6 text-emerald-800">จัดการธีม</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FileUpload
            onChange={handleFileChange}
            onRemove={handleRemoveFile}
            fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            previewUrl={previewUrl}
            currentUrl={currentUrl}
            label="รูปภาพธีม"
            disabled={isSubmitting}
            resetKey={fileInputKey}
          />

          <div>
            <div className="space-y-4">
              <Input
                label="ชื่อธีม"
                {...register("name")}
                placeholder="ชื่อธีม"
                error={errors.name?.message}
              />
              <Input
                label="ราคา (บาท)"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
                error={errors.price?.message}
              />

              <Textarea
                label="รายละเอียด"
                {...register("description")}
                placeholder="รายละเอียดธีม"
                error={errors.description?.message}
              />
              <Button
                loading={isSubmitting}
                type="submit"
                className="w-full bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
              >
                บันทึก
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateThemeForm;
