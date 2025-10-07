import { advertisementService } from "@/features/advertisement/services/advertisement.service";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { AdvertisementSchema } from "../schemas/advertisement.schema";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";

interface ICreateAdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FormSchema = AdvertisementSchema.omit({
  id: true,
  image_url: true,
  created_at: true,
});

type FormFields = z.infer<typeof FormSchema>;

const CreateAdvertisementModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ICreateAdvertisementModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pathname_to_display: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("ไฟล์มีขนาดใหญ่เกินไป กรุณาอัพโหลดไฟล์ขนาดไม่เกิน 5MB");
      return;
    }

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    setFileInputKey(Date.now()); // Reset file input
  };

  const onSubmit = async (data: FormFields) => {
    if (!imageFile) {
      setImageError("กรุณาอัพโหลดรูปภาพ");
      return;
    }

    try {
      if (!imageFile) {
        showErrorAlert("กรุณาอัพโหลดรูปภาพ");
        return;
      }
      setIsSubmitting(true);

      const createdAdvertisement =
        await advertisementService.createAdvertisement(data);

      if (!createdAdvertisement) {
        showErrorAlert("ไม่สามารถเพิ่มโฆษณาได้ กรุณาลองใหม่อีกครั้ง");
        return;
        }

      try {
        const imagePath = await advertisementService.uploadAdvertisementImage(
          createdAdvertisement.id,
          imageFile
        );

        const imageUrl =
          advertisementService.getAdvertisementImageUrlByPath(imagePath);

        await advertisementService.updateAdvertisement(
          createdAdvertisement.id,
          {
            image_url: imageUrl,
          }
        );

        showSuccessAlert("เพิ่มโฆษณาใหม่เรียบร้อยแล้ว");

        reset();

        handleRemoveFile();

        onClose();

        window.location.reload();
      } catch (error: any) {
        await advertisementService.deleteAdvertisement(createdAdvertisement.id);

        showErrorAlert(
          error.message || "ไม่สามารถเพิ่มโฆษณาได้ กรุณาลองใหม่อีกครั้ง"
        );
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      showErrorAlert(
        error.message || "ไม่สามารถเพิ่มโฆษณาได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      handleRemoveFile();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-800">
            เพิ่มโฆษณาใหม่
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            กรอกข้อมูลโฆษณาที่ต้องการเพิ่ม
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รูปภาพโฆษณา
            </label>

            {previewUrl ? (
              <div className="space-y-4 w-full">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
                  <Image
                    src={previewUrl}
                    alt="รูปภาพโฆษณา"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                  <Button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 h-auto w-auto rounded-full shadow-md transition-colors duration-200"
                    aria-label="ลบรูปภาพ"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {imageFile && (
                  <p className="text-xs text-gray-500 text-center">
                    {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-300 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors duration-200">
                <ImageIcon className="h-12 w-12 text-emerald-500 mb-4" />
                <p className="text-gray-700 mb-4 text-center font-medium">
                  อัพโหลดรูปภาพโฆษณา
                </p>
                <label className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer flex items-center gap-2 transition-colors shadow-sm">
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
                <p className="text-sm text-gray-500 mt-3 text-center">
                  รองรับไฟล์: JPG, PNG, WEBP (ไม่เกิน 5MB)
                </p>
              </div>
            )}
            {imageError && (
              <p className="mt-1 text-sm text-red-500">{imageError}</p>
            )}
          </div>

          <Input
            label="url ที่ต้องการแสดงโฆษณา"
            placeholder="ระบุ url ที่ต้องการแสดงโฆษณา"
            error={errors.pathname_to_display?.message}
            {...register("pathname_to_display")}
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
              เพิ่มโฆษณา
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdvertisementModal;
