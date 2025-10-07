import { useCallback, useEffect, useRef, useState } from "react";
import { showErrorAlert } from "../utils/swal.utils";

interface FileUploadOptions {
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  initialFileUrl?: string | null;
}

export function useFileUpload({
  maxSizeMB = 5,
  acceptedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  initialFileUrl = null,
}: FileUploadOptions = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(initialFileUrl);
  const [isChanged, setIsChanged] = useState(false);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use useCallback to memoize these functions
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;
      if (selectedFile) {
        // Validate file type
        if (!acceptedFileTypes.includes(selectedFile.type)) {
          showErrorAlert(
            `กรุณาอัพโหลดไฟล์ที่รองรับเท่านั้น (${acceptedFileTypes
              .map((type) => type.split("/")[1])
              .join(", ")})`
          );
          return;
        }

        // Validate file size
        if (selectedFile.size > maxSizeMB * 1024 * 1024) {
          showErrorAlert(`กรุณาอัพโหลดไฟล์ขนาดไม่เกิน ${maxSizeMB}MB`);
          return;
        }

        // Clean up previous preview URL if exists
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        setCurrentUrl(null);
        setIsChanged(true);
      }
    },
    [acceptedFileTypes, maxSizeMB, previewUrl]
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setCurrentUrl(null);
    setIsChanged(true);

    // Force file input to reset by changing its key
    setFileInputKey(Date.now());
  }, [previewUrl]);

  const onResetFileInput = useCallback(() => {
    setFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setCurrentUrl(initialFileUrl);
    setIsChanged(false);

    setFileInputKey(Date.now());
  }, [initialFileUrl, previewUrl]);

  const resetFileInput = useCallback(() => {
    setFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setCurrentUrl(initialFileUrl);
    setIsChanged(false);

    // Force file input to reset by changing its key
    setFileInputKey(Date.now());
  }, [initialFileUrl, previewUrl]);

  // Set initial URL only once when the component mounts or when initialFileUrl changes
  useEffect(() => {
    setCurrentUrl(initialFileUrl);
  }, [initialFileUrl]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    file,
    previewUrl,
    currentUrl,
    isChanged,
    fileInputRef,
    fileInputKey,
    handleFileChange,
    handleRemoveFile,
    resetFileInput,
    onResetFileInput,
  };
}
