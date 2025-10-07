import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Theme, ThemeSchema } from "../schemas/theme.schema";
import { themeService } from "../services/theme.service";

interface IEditThemeModalProps {
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const FormSchema = ThemeSchema.pick({
  name: true,
  price: true,
  description: true,
});

type FormSchemaType = z.infer<typeof FormSchema>;

const EditThemeModal = ({
  theme,
  isOpen,
  onClose,
  onRefresh,
}: IEditThemeModalProps) => {
  const [themeFile, setThemeFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: theme.name,
      price: theme.price,
      description: theme.description || "",
    },
  });

  // Reset everything when the modal opens or theme changes
  useEffect(() => {
    if (isOpen) {
      // Reset form
      reset({
        name: theme.name,
        price: theme.price,
        description: theme.description || "",
      });

      // Reset file state
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setThemeFile(null);
      setPreviewUrl(null);
      setCurrentImageUrl(theme.image_url);
      setImageChanged(false);
      setFileInputKey(Date.now());
    }
  }, [theme, reset, isOpen]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input change event triggered");
    console.log("Files:", e.target.files);

    const file = e.target.files?.[0] || null;

    if (file) {
      console.log("File selected:", file.name, file.type, file.size);

      // Validate file type
      const acceptedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!acceptedTypes.includes(file.type)) {
        showErrorAlert("กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP)");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorAlert("กรุณาอัพโหลดไฟล์ขนาดไม่เกิน 5MB");
        return;
      }

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Create new preview
      const newPreviewUrl = URL.createObjectURL(file);
      console.log("Created new preview URL:", newPreviewUrl);

      setThemeFile(file);
      setPreviewUrl(newPreviewUrl);
      setCurrentImageUrl(null); // Clear current image when new file is selected
      setImageChanged(true);
    }
  };

  const handleRemoveFile = () => {
    console.log("Remove file triggered");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setThemeFile(null);
    setPreviewUrl(null);
    setCurrentImageUrl(null);
    setImageChanged(true);

    // Force file input to reset
    setFileInputKey(Date.now());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormSchemaType) => {
    try {
      let imageUrl = theme.image_url;

      if (imageChanged) {
        if (themeFile) {
          try {
            console.log("Uploading new image file:", themeFile.name);
            const imagePath = await themeService.uploadThemeImage(
              theme.id,
              themeFile
            );
            imageUrl = themeService.getImagePublicUrl(imagePath);
            console.log("New image URL:", imageUrl);
          } catch (error: any) {
            console.error("Image upload error:", error);
            showErrorAlert(error.message || "ไม่สามารถอัพโหลดรูปภาพได้");

            return;
          }
        } else {
          // If image was removed and no new image was selected
          console.log("Removing image, setting to null");
          imageUrl = null;
        }
      }

      if (isDirty || imageChanged) {
        console.log("Updating theme with data:", {
          ...data,
          image_url: imageUrl,
        });

        await themeService.updateTheme(theme.id, {
          ...data,
          image_url: imageUrl,
        });

        showSuccessAlert("อัปเดตข้อมูลธีมเรียบร้อย");
      }

      onClose();
    } catch (error: any) {
      console.error("Theme update error:", error);
      showErrorAlert(error.message || "ไม่สามารถอัปเดตข้อมูลธีมได้");
    } finally {
      onRefresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald-800">แก้ไขข้อมูลธีม</DialogTitle>
          <DialogDescription>แก้ไขข้อมูลและรูปภาพของธีม</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                รูปภาพธีม
              </label>

              <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 flex flex-col items-center justify-center">
                {previewUrl || currentImageUrl ? (
                  <div className="space-y-4 w-full">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-emerald-200">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Theme preview"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 600px"
                          priority
                          key={`preview-${previewUrl}`}
                        />
                      ) : currentImageUrl ? (
                        <Image
                          src={currentImageUrl}
                          alt="Current theme"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 600px"
                          priority
                          key={`current-${currentImageUrl}`}
                        />
                      ) : null}
                      <Button
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 h-auto w-auto rounded-full"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {previewUrl && (
                      <p className="text-xs text-gray-500 text-center">
                        {themeFile?.name} (
                        {Math.round((themeFile?.size || 0) / 1024)} KB)
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 text-emerald-400 mb-4" />
                    <p className="text-gray-600 mb-4 text-center">
                      อัพโหลดรูปภาพธีม
                    </p>
                    <label className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer flex items-center gap-2 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>เลือกไฟล์</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isSubmitting}
                        key={fileInputKey}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      รองรับไฟล์: JPG, PNG, WEBP (ไม่เกิน 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            <Input
              label="ชื่อธีม"
              {...register("name")}
              placeholder="ชื่อธีม"
              error={errors.name?.message}
              className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            />

            <Input
              label="ราคา (บาท)"
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
              error={errors.price?.message}
              className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            />

            <Textarea
              label="รายละเอียด"
              {...register("description")}
              placeholder="รายละเอียดธีม"
              error={errors.description?.message}
              className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 min-h-[120px]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              ยกเลิก
            </Button>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || (!isDirty && !imageChanged)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              บันทึกการเปลี่ยนแปลง
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditThemeModal;
