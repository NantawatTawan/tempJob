import { useModal } from "@/shared/hooks/useModal";
import {
  showConfirmationAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/shared/utils/swal.utils";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { Advertisement } from "../schemas/advertisement.schema";
import { advertisementService } from "../services/advertisement.service";
import EditAdvertisementModal from "./EditAdvertisementModal";

interface IAdvertisementRowProps {
  ad: Advertisement;
  onRefresh: () => void;
}

const AdvertisementRow = ({ ad, onRefresh }: IAdvertisementRowProps) => {
  const { isOpen, onOpen, onClose } = useModal();

  async function handleDeleteAdvertisement() {
    try {
      const { isConfirmed } = await showConfirmationAlert(
        "ยืนยันการลบโฆษณา",
        "คุณแน่ใจที่จะลบโฆษณานี้หรือไม่?"
      );

      if (!isConfirmed) return;

      await advertisementService.deleteAdvertisement(ad.id);

      showSuccessAlert("ลบโฆษณาเรียบร้อยแล้ว");
      onRefresh();
    } catch (error: any) {
      showErrorAlert(
        error.message || "ไม่สามารถลบโฆษณาได้ กรุณาลองใหม่อีกครั้ง"
      );
    }
  }

  return (
    <>
      <EditAdvertisementModal
        isOpen={isOpen}
        onClose={onClose}
        onRefresh={onRefresh}
        advertisement={ad}
      />
      <tr key={ad.id} className="hover:bg-green-50">
        <td className="px-4 py-3">
          <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden">
            {ad.image_url ? (
              <Image
                src={ad.image_url}
                alt={ad.pathname_to_display || "Advertisement"}
                width={80}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-xs text-gray-500">ไม่มีรูป</span>
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-800">
          {ad.pathname_to_display || "ไม่ระบุ"}
        </td>
        <td className="px-4 py-3 text-sm text-gray-800">
          {new Date(ad.created_at).toLocaleDateString("th-TH")}
        </td>

        <td className="px-4 py-3">
          <div className="flex justify-start gap-2">
            <button
              className="p-1 text-green-600 hover:text-green-800"
              title="แก้ไข"
              onClick={onOpen}
            >
              <Edit size={18} />
            </button>
            <button
              className="p-1 text-red-600 hover:text-red-800"
              title="ลบ"
              onClick={handleDeleteAdvertisement}
            >
              <Trash size={18} />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default AdvertisementRow;
