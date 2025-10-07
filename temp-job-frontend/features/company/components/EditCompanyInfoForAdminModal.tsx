import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { useProvinces } from "@/shared/hooks/useProvinces";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFetchAllCompanyTypes } from "../hooks/queries/useFetchAllCompanyTypes";
import { CompanyInfoForAdmin, CompanySchema } from "../schemas/company.schema";
import { companyService } from "../services/company.service";

interface IEditCompanyInfoForAdminModalProps {
  company: CompanyInfoForAdmin;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onRefresh: () => void;
}

const FormSchema = CompanySchema.omit({
  id: true,
  user_id: true,
  subscription_id: true,
  package_id: true,
});

type FormFields = z.infer<typeof FormSchema>;

const EditCompanyInfoForAdminModal = ({
  company,
  isOpen,
  onClose,
  onSuccess,
  onRefresh,
}: IEditCompanyInfoForAdminModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues: company,
  });

  const { data: companyTypes } = useFetchAllCompanyTypes();

  const { province, district } = watch();
  const { provinces, amphures, tambons } = useProvinces(province, district);

  const onSubmit = async (data: FormFields) => {
    try {
      setIsSubmitting(true);

      await companyService.updateCompanyInfoByCompanyId(company.id, data);

      showSuccessAlert("บันทึกข้อมูลเรียบร้อย");

      onSuccess();
      onClose();
    } catch (error: any) {
      showErrorAlert(error.message);
    } finally {
      setIsSubmitting(false);
      onRefresh();
    }
  };

  if (!isOpen) return null;

  console.error(errors);

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
              แก้ไขข้อมูลบริษัท
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="ชื่อบริษัท"
                  {...register("company_name")}
                  placeholder="ชื่อบริษัท"
                  error={errors.company_name?.message}
                />

                <Select
                  label="ลักษณะธุรกิจ"
                  {...register("company_type_id", {
                    setValueAs: (value) => (value ? parseInt(value, 10) : null),
                  })}
                  placeholder="เลือกประเภทธุรกิจ"
                  options={
                    companyTypes?.map((companyType) => ({
                      value: companyType.id.toString(),
                      label: companyType.title,
                    })) ?? []
                  }
                  error={errors.company_type_id?.message}
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="รายละเอียดเพิ่มเติมเกี่ยวกับบริษัท"
                    {...register("additional_info")}
                    placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับบริษัท"
                    error={errors.additional_info?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="ที่อยู่บริษัท"
                    {...register("address")}
                    rows={3}
                    error={errors.address?.message}
                  />
                </div>

                <Select
                  label="จังหวัด"
                  {...register("province")}
                  options={
                    provinces?.map((province) => ({
                      label: province.value,
                      value: province.key,
                    })) ?? []
                  }
                  error={errors.province?.message}
                />

                <Select
                  label="เขต/อำเภอ"
                  {...register("district")}
                  options={
                    amphures?.map((amphure) => ({
                      label: amphure.value,
                      value: amphure.key,
                    })) ?? []
                  }
                  error={errors.district?.message}
                />

                <Select
                  label="แขวง/ตำบล"
                  {...register("sub_district")}
                  options={
                    tambons?.map((tambon) => ({
                      label: tambon.value,
                      value: tambon.key,
                    })) ?? []
                  }
                  error={errors.sub_district?.message}
                />

                <Input
                  label="รหัสไปรษณีย์"
                  {...register("zip_code")}
                  error={errors.zip_code?.message}
                />

                <Input
                  label="เบอร์โทรศัพท์"
                  type="tel"
                  {...register("company_phone_number")}
                  error={errors.company_phone_number?.message}
                />

                <Input
                  label="อีเมลติดต่อ"
                  type="email"
                  {...register("company_email")}
                  error={errors.company_email?.message}
                />

                <Input
                  label="ชื่อผู้ติดต่อ"
                  {...register("company_contact_person_name")}
                  placeholder="ชื่อผู้ติดต่อ"
                  error={errors.company_contact_person_name?.message}
                />

                <Input
                  label="เลขประจำตัวผู้เสียภาษี"
                  {...register("tax_no")}
                  placeholder="เลขประจำตัวผู้เสียภาษี"
                  error={errors.tax_no?.message}
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="การเดินทางมายังบริษัท"
                    {...register("transportation_guide")}
                    rows={3}
                    placeholder="รายละเอียดการเดินทาง"
                    error={errors.transportation_guide?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="ลิงค์แผนที่บริษัท"
                    {...register("company_location_map_url")}
                    error={errors.company_location_map_url?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="สวัสดิการ"
                    {...register("welfare")}
                    rows={4}
                    error={errors.welfare?.message}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
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
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyInfoForAdminModal;
