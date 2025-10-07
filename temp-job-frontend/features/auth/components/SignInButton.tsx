"use client";
import { Button } from "@/shared/components/ui/button";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const SignInButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => router.push("/sign-in")}
    >
      <User size={16} />
      <span>เข้าสู่ระบบ</span>
    </Button>
  );
};

export default SignInButton;
