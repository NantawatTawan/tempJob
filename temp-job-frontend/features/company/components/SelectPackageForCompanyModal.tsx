import { useFetchPackages } from "@/features/packages/hooks/queries/useFetchPackages";
import { Button } from "@/shared/components/ui/button";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { companyService } from "../services/company.service";

interface ISelectPackageForCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  companyId: string;
  currentPackageId?: string;
}

const SelectPackageForCompanyModal = ({
  isOpen,
  onClose,
  onRefresh,
  companyId,
  currentPackageId,
}: ISelectPackageForCompanyModalProps) => {
  const { data: packages, isFetching } = useFetchPackages();

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    currentPackageId || null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPackage = async () => {
    if (!selectedPackageId) {
      showErrorAlert("กรุณาเลือกแพ็คเกจ");
      return;
    }

    try {
      setIsSubmitting(true);

      await companyService.assignPackageToCompany(
        companyId,
        Number(selectedPackageId)
      );

      showSuccessAlert("อัพเดทแพ็คเกจเรียบร้อย");

      onClose();
    } catch (error: any) {
      showErrorAlert(error.message);
    } finally {
      setIsSubmitting(false);
      onRefresh();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              เลือกแพ็คเกจสำหรับบริษัท
            </h3>
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
            {isFetching ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    เลือกแพ็คเกจที่ต้องการให้กับบริษัทนี้
                    แพ็คเกจจะกำหนดจำนวนประกาศงานที่บริษัทสามารถโพสต์ได้
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {packages?.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`cursor-pointer rounded-lg border p-6 transition-all hover:shadow-md ${
                        selectedPackageId === pkg.id.toString()
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedPackageId(pkg.id.toString())}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900">
                          {pkg.name}
                        </h4>
                        {selectedPackageId === pkg.id.toString() && (
                          <div className="rounded-full bg-emerald-500 p-1 text-white">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <p>
                        {pkg.life_span_in_months} เดือน {pkg.jobs_limit} ตำแหน่ง
                      </p>

                      <p className="text-gray-600">{pkg.description}</p>
                    </div>
                  ))}
                </div>

                {packages?.length === 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                    <p className="text-gray-500">ไม่พบข้อมูลแพ็คเกจ</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-200 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-300"
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              onClick={handleSelectPackage}
              disabled={isSubmitting || !selectedPackageId}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPackageForCompanyModal;
