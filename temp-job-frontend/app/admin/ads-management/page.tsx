"use client";
import AdvertisementTable from "@/features/advertisement/components/AdvertisementTable";
import CreateAdvertisementModal from "@/features/advertisement/components/CreateAdvertisementModal";
import { Button } from "@/shared/components/ui/button";
import { useModal } from "@/shared/hooks/useModal";
import { Plus } from "lucide-react";

const AdminAdsManagementPage = () => {
  const { isOpen, onOpen, onClose } = useModal();
  return (
    <>
      <CreateAdvertisementModal isOpen={isOpen} onClose={onClose} />
      <div className="flex min-h-screen bg-primary">
        <section
          id="ads-management"
          className="bg-white rounded-lg shadow-sm w-full p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-green-800">
              จัดการโฆษณา
            </h2>
            <Button
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              onClick={onOpen}
            >
              <Plus size={16} />
              <span>เพิ่มโฆษณาใหม่</span>
            </Button>
          </div>
          <AdvertisementTable />
        </section>
      </div>
    </>
  );
};

export default AdminAdsManagementPage;
