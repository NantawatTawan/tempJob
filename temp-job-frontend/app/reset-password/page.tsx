"use client";
import { authService } from "@/features/auth/services/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "กรุณากรอกอีเมล" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
});

type FormFields = z.infer<typeof FormSchema>;

const ResetPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

      await authService.sendPasswordResetEmail(data.email);

      setEmailSent(true);
      
      showSuccessAlert("ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว");
    } catch (error: any) {
      showErrorAlert(error.message || "ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-emerald-50 min-h-screen pt-36 px-24">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-semibold mb-6 text-emerald-800">
            รีเซ็ตรหัสผ่าน
          </h1>

          {emailSent ? (
            <div className="text-center py-6">
              <div className="text-emerald-600 text-5xl mb-4">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <h2 className="text-xl font-medium mb-2">ตรวจสอบอีเมลของคุณ</h2>
              <p className="text-gray-600 mb-6">
                เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว
                กรุณาตรวจสอบและทำตามคำแนะนำ
              </p>
              <Link href="/sign-in">
                <Button
                  type="button"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                กรอกอีเมลที่คุณใช้ลงทะเบียน
                เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้คุณ
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="อีเมล"
                  placeholder="กรอกอีเมลของคุณ"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  ส่งลิงก์รีเซ็ตรหัสผ่าน
                </Button>

                <div className="text-center mt-4">
                  <Link
                    href="/sign-in"
                    className="text-emerald-600 hover:underline"
                  >
                    กลับไปหน้าเข้าสู่ระบบ
                  </Link>
                </div>
              </form>
            </>
          )}
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

export default ResetPasswordPage;
