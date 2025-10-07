import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef, useEffect } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import {
  Advertisement,
  AdvertisementSchema,
} from "../schemas/advertisement.schema";
import { advertisementService } from "../services/advertisement.service";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";

interface IEditAdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  advertisement: Advertisement;
}

const FormSchema = AdvertisementSchema.omit({
  id: true,
  created_at: true,
  image_url: true,
});

type FormFields = z.infer<typeof FormSchema>;

const EditAdvertisementModal = ({
  isOpen,
  onClose,
  onRefresh,
  advertisement,
}: IEditAdvertisementModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());

  const form = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pathname_to_display: advertisement?.pathname_to_display || "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!advertisement) return;

    if (advertisement.image_url) {
      setPreviewUrl(advertisement.image_url);
    }

    setValue("pathname_to_display", advertisement.pathname_to_display);
  }, [advertisement, isOpen, setValue]);

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

    // Clean up previous preview URL if it's not from the server
    if (previewUrl && !previewUrl.includes("http")) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    if (previewUrl && !previewUrl.includes("http")) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    setFileInputKey(Date.now()); // Reset file input
  };

  const onSubmit = async (data: FormFields) => {
    if (!advertisement?.id) {
      showErrorAlert("ไม่พบข้อมูลโฆษณาที่ต้องการแก้ไข");
      return;
    }

    try {
      setIsSubmitting(true);

      const updateData: Partial<Advertisement> = {
        pathname_to_display: data.pathname_to_display,
      };

      // If there's a new image file, upload it
      if (imageFile) {
        try {
          const imagePath = await advertisementService.uploadAdvertisementImage(
            advertisement.id,
            imageFile
          );

          const imageUrl =
            advertisementService.getAdvertisementImageUrlByPath(imagePath);
          updateData.image_url = imageUrl;
        } catch (error: any) {
          showErrorAlert(
            error.message || "ไม่สามารถอัพโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง"
          );
          setIsSubmitting(false);
          return;
        }
      }

      await advertisementService.updateAdvertisement(
        advertisement.id,
        updateData
      );

      showSuccessAlert("แก้ไขโฆษณาเรียบร้อยแล้ว");

      reset();
      handleRemoveFile();
      onRefresh();
    } catch (error: any) {
      showErrorAlert(
        error.message || "ไม่สามารถแก้ไขโฆษณาได้ กรุณาลองใหม่อีกครั้ง"
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-800">
            แก้ไขโฆษณา
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              รูปภาพโฆษณา
            </label>
            {previewUrl ? (
              <div className="relative">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Advertisement preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    onClick={handleRemoveFile}
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
              บันทึกการแก้ไข
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdvertisementModal;
