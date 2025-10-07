import { useFetchPackages } from "@/features/packages/hooks/queries/useFetchPackages";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Mail, Package } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CredentialsSchema } from "../../auth/schemas/auth.schema";
import { CompanySchema } from "../schemas/company.schema";
import { companyService } from "../services/company.service";

const FormSchema = CredentialsSchema.pick({
  email: true,
  password: true,
})
  .merge(CompanySchema.pick({ company_name: true }))
  .extend({
    package_id: z.string().optional(),
  });

type FormFields = z.infer<typeof FormSchema>;

interface CreateCompanyAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCompanyAccountForm = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateCompanyAccountFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      company_name: "",
      package_id: undefined,
    },
  });

  const { data: packages, isLoading: isLoadingPackages } = useFetchPackages();

  const onSubmit = async (data: FormFields) => {
    try {
      setIsSubmitting(true);

      await companyService.createNewCompanyAccountByAdmin(
        {
          company_name: data.company_name,
          package_id: data.package_id ?? undefined,
        },
        {
          email: data.email,
          password: data.password,
        }
      );

      showSuccessAlert("สร้างบัญชีบริษัทเรียบร้อย");

      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      showErrorAlert(
        error.message || "ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง"
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald-800 flex items-center gap-2">
            <Building className="h-5 w-5" />
            สร้างบัญชีบริษัทใหม่
          </DialogTitle>
          <DialogDescription>
            กรอกข้อมูลเบื้องต้นเพื่อสร้างบัญชีบริษัทใหม่ในระบบ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Input
                  label="E-mail"
                  type="text"
                  placeholder="E-mail"
                  {...register("email")}
                  error={errors.email?.message}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <Input
                  label="ชื่อบริษัท"
                  type="text"
                  placeholder="ชื่อบริษัท"
                  {...register("company_name")}
                  error={errors.company_name?.message}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Input
                  label="รหัสผ่าน"
                  type="password"
                  placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร"
                  {...register("password")}
                  error={errors.password?.message}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 mb-2">
                <Package className="h-4 w-4" />
                <span>เลือกแพ็คเกจ</span>
              </div>

              <Select
                {...register("package_id")}
                options={
                  packages?.map((pkg) => ({
                    label: `${pkg.name} - ${pkg.life_span_in_months} เดือน ${pkg.jobs_limit} ตำแหน่ง`,
                    value: pkg.id.toString(),
                  })) ?? []
                }
                placeholder={
                  isLoadingPackages ? "กำลังโหลดข้อมูล..." : "เลือกแพ็คเกจ"
                }
                error={errors.package_id?.message}
                className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                disabled={isLoadingPackages}
              />

              <p className="text-xs text-gray-500 mt-1">
                แพ็คเกจจะกำหนดจำนวนประกาศงานที่บริษัทสามารถโพสต์ได้
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              ล้างข้อมูล
            </Button>

            <Button
              type="submit"
              loading={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  กำลังสร้างบัญชี...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  สร้างบัญชีบริษัท
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCompanyAccountForm;
