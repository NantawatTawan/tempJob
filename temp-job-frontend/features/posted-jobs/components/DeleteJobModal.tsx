import React from "react";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  jobTitle: string;
  isDeleting: boolean;
}

const DeleteJobModal: React.FC<DeleteJobModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  isDeleting,
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-10">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">ยืนยันการลบประกาศงาน</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            คุณต้องการลบประกาศงาน <span className="font-medium text-gray-900">"{jobTitle}"</span> ใช่หรือไม่? 
            การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="border-gray-300"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "กำลังลบ..." : "ลบประกาศงาน"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteJobModal;
