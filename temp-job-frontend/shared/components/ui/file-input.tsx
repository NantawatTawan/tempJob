import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  label?: string;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  value?: File | null;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  previewUrl?: string;
  showPreview?: boolean;
  variant?: "default" | "small" | "fluid" | "square";
  promptText?: string;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ 
    className, 
    label, 
    error, 
    accept = "image/*", 
    maxSize = 5, // Default 5MB
    value,
    onChange,
    onBlur,
    previewUrl,
    showPreview = true,
    variant = "default",
    promptText = "เลือกไฟล์",
    ...props 
  }, ref) => {
    const [preview, setPreview] = useState<string | null>(previewUrl || null);
    const [dragActive, setDragActive] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFile = (file: File | null) => {
      if (!file) {
        setPreview(null);
        onChange?.(null);
        return;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setFileError(`ไฟล์ขนาดใหญ่เกินไป (สูงสุด ${maxSize}MB)`);
        return;
      }

      // Check file type
      if (accept !== "*" && !accept.split(",").some(type => {
        if (type.includes("/*")) {
          const mainType = type.split("/")[0].trim();
          return file.type.startsWith(mainType);
        }
        return file.type === type.trim();
      })) {
        setFileError(`ประเภทไฟล์ไม่ถูกต้อง (รองรับ ${accept})`);
        return;
      }

      setFileError(null);
      onChange?.(file);

      // Create preview for images
      if (file.type.startsWith("image/") && showPreview) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFile(file);
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    const handleRemove = () => {
      setPreview(null);
      onChange?.(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    const isImage = preview || (value && value.type?.startsWith("image/"));
    const fileName = value?.name || "";
    const displayError = error || fileError;

    // Set dimensions based on variant
    const getVariantClasses = () => {
      switch (variant) {
        case "small":
          return {
            container: "p-2",
            preview: "h-24",
            icon: "h-8 w-8",
            iconSize: 16
          };
        case "fluid":
          return {
            container: "p-3",
            preview: "h-auto aspect-video",
            icon: "h-10 w-10",
            iconSize: 18
          };
        case "square":
          return {
            container: "p-0 aspect-square",
            preview: "aspect-square h-full",
            icon: "h-10 w-10",
            iconSize: 20,
            wrapper: "flex items-center justify-center h-full"
          };
        default:
          return {
            container: "p-4",
            preview: "h-48",
            icon: "h-12 w-12",
            iconSize: 24
          };
      }
    };

    const variantClasses = getVariantClasses();

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg transition-colors cursor-pointer",
            variantClasses.container,
            dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-emerald-400",
            displayError && "border-red-300",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {preview ? (
            <div className="relative h-full">
              <div className={cn("relative w-full rounded-md overflow-hidden", variantClasses.preview)}>
                <Image 
                  src={preview} 
                  alt="Preview" 
                  fill 
                  className={cn("object-contain", variant === "square" && "object-cover")}
                />
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : value && !isImage ? (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <FileText className="text-emerald-500 mr-2" size={20} />
                <span className="text-sm text-gray-700 truncate max-w-[200px]">{fileName}</span>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="text-red-500 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className={cn("text-center py-4", variantClasses.wrapper)}>
              <div className={cn("mx-auto text-gray-400 flex items-center justify-center rounded-full bg-gray-100", variantClasses.icon)}>
                {accept.includes("image") ? (
                  <ImageIcon className="h-6 w-6" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
              </div>
              {variant !== "square" && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {variant === "small" ? (
                      <span className="text-emerald-600 hover:text-emerald-500 font-medium">{promptText}</span>
                    ) : (
                      <>
                        ลากไฟล์มาวางที่นี่ หรือ{" "}
                        <span className="text-emerald-600 hover:text-emerald-500 font-medium">{promptText}</span>
                      </>
                    )}
                  </p>
                  {variant !== "small" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {accept === "image/*" 
                        ? "รองรับไฟล์รูปภาพทุกประเภท" 
                        : `รองรับไฟล์ ${accept}`}
                      {maxSize && ` (ขนาดสูงสุด ${maxSize}MB)`}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          <input
            type="file"
            className="hidden"
            ref={(e) => {
              // Handle both refs
              if (typeof ref === 'function') {
                ref(e);
              } else if (ref) {
                ref.current = e;
              }
              inputRef.current = e;
            }}
            accept={accept}
            onChange={handleChange}
            onBlur={onBlur}
            {...props}
          />
        </div>
        
        {displayError && (
          <p className="mt-1 text-sm text-red-500">{displayError}</p>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput }; 