"use client";
import { authService } from "@/features/auth/services/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type FormFields = z.infer<typeof FormSchema>;

const UpdatePasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: FormFields) => {
    try {
      setIsSubmitting(true);
      
      await authService.updatePassword(data.password);
      
      showSuccessAlert("รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว");
      
      // Redirect to sign-in page after successful password update
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error: any) {
      showErrorAlert(error.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-emerald-50 min-h-screen pt-36 px-24">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-semibold mb-6 text-emerald-800">
            ตั้งรหัสผ่านใหม่
          </h1>
          
          <p className="text-gray-600 mb-6">
            กรุณากำหนดรหัสผ่านใหม่ของคุณ
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="รหัสผ่านใหม่"
              type="password"
              placeholder="กรอกรหัสผ่านใหม่"
              error={errors.password?.message}
              {...register("password")}
            />
            
            <Input
              label="ยืนยันรหัสผ่านใหม่"
              type="password"
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              บันทึกรหัสผ่านใหม่
            </Button>
          </form>
        </div>
      </div>
      
      <footer
        id="footer"
        className="py-4 text-center text-sm text-gray-500 border-t mt-auto"
      >
        <div className="max-w-7xl mx-auto">
          สงวนลิขสิทธิ์ © 2025 TempJob | เงื่อนไขข้อตกลงการใช้บริการ |
          นโยบายความเป็นส่วนตัว | นโยบายคุกกี้
        </div>
      </footer>
    </div>
  );
};

export default UpdatePasswordPage; 