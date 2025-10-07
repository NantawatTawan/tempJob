"use client";
import AdvertisementCarousel from "@/features/advertisement/components/AdvertisementCarousel";
import { useUser } from "@/features/auth/hooks/useUser";
import {
  Credentials,
  CredentialsSchema,
} from "@/features/auth/schemas/auth.schema";
import { authService } from "@/features/auth/services/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { showErrorAlert, showSuccessAlert } from "@/shared/utils/swal.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({ resolver: zodResolver(CredentialsSchema) });

  const { data: user } = useUser();

  const router = useRouter();

  if (user) {
    router.push("/posted-jobs");
    return null;
  }

  async function onSubmit(credentials: Credentials) {
    try {
      const { user } = await authService.signInWithEmailAndPassword(
        credentials
      );

      if (!user) {
        showErrorAlert("ล้มเหลวในการเข้าสู่ระบบ");
        return;
      }

      showSuccessAlert("เข้าสู่ระบบสำเร็จ");

      router.push("/posted-jobs");
    } catch (error: any) {
      showErrorAlert(error.message);
    }
  }

  return (
    <div className="flex flex-col bg-primary h-screen pt-36 px-24">
      <div className="flex w-full gap-x-[50px] items-center justify-center px-26">
        <AdvertisementCarousel className="h-full w-1/2" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="login-form"
          className="w-1/2 bg-white rounded-lg shadow-sm p-8 flex flex-col gap-4 justify-center h-full"
        >
          <h1 className="text-2xl font-semibold mb-8">
            เข้าสู่ระบบสำหรับบริษัท
          </h1>
          <Input
            label="อีเมลบริษัท"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="รหัสผ่าน"
            error={errors.password?.message}
            {...register("password")}
            type="password"
          />
          <div className="text-right">
            <Link href="/reset-password">
              <span className="text-gray-500 hover:text-emerald-600 cursor-pointer">
                ลืมรหัสผ่าน
              </span>
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700"
          >
            เข้าสู่ระบบ
          </Button>
          <p className="text-center mt-6 text-gray-600">
            ยังไม่มีบัญชีบริษัทใน TempJob?
            <Link href="/contact">
              <span className="text-emerald-600 hover:underline cursor-pointer">
                สมัครสมาชิก
              </span>
            </Link>
          </p>
        </form>
      </div>
      <footer
        id="footer"
        className="py-4 text-center text-sm text-gray-500 border-t mt-auto"
      >
        <div className="max-w-7xl mx-auto">
          สงวนลิขสิทธิ์ © 2025 tempjob | เงื่อนไขข้อตกลงการใช้บริการ |
          นโยบายความเป็นส่วนตัว | นโยบายคุกกี้
        </div>
      </footer>
    </div>
  );
};

export default SignInPage;
