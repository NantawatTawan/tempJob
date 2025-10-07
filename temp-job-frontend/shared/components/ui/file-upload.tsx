import React from "react";
import { Button } from "./button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  previewUrl: string | null;
  currentUrl: string | null;
  accept?: string;
  maxSize?: number;
  label?: string;
  helperText?: string;
  className?: string;
  previewClassName?: string;
  error?: string;
  disabled?: boolean;
  resetKey?: string | number;
}

export function FileUpload({
  onChange,
  onRemove,
  fileInputRef,
  previewUrl,
  currentUrl,
  accept = "image/jpeg,image/png,image/webp",
  maxSize = 5,
  label = "อัพโหลดไฟล์",
  helperText = `รองรับไฟล์: JPG, PNG, WEBP (ไม่เกิน ${maxSize}MB)`,
  className,
  previewClassName,
  error,
  disabled = false,
  resetKey = "default",
}: FileUploadProps) {
  const hasPreview = previewUrl || currentUrl;
  const imageUrl = previewUrl || currentUrl;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 flex flex-col items-center justify-center">
        {hasPreview && imageUrl ? (
          <div className="space-y-4 w-full">
            <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg border border-emerald-200", previewClassName)}>
              <Image
                src={imageUrl}
                alt="File preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
                key={imageUrl}
              />
              <Button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 h-auto w-auto rounded-full"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {previewUrl && (
              <p className="text-xs text-gray-500 text-center">
                New image selected
              </p>
            )}
          </div>
        ) : (
          <>
            <ImageIcon className="h-12 w-12 text-emerald-400 mb-4" />
            <p className="text-gray-600 mb-4 text-center">{label}</p>
            <label className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer flex items-center gap-2 transition-colors">
              <Upload className="h-4 w-4" />
              <span>เลือกไฟล์</span>
              <input
                type="file"
                className="hidden"
                accept={accept}
                onChange={onChange}
                ref={fileInputRef}
                disabled={disabled}
                key={resetKey}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {helperText}
            </p>
          </>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
} 