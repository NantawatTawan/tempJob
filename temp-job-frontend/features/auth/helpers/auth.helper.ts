export function translateSupabaseAuthErrorMessage(error: string): string {
  console.log(error);
  switch (error.toLowerCase()) {
    case "invalid login credentials":
      return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    case "email not confirmed":
      return "กรุณายืนยันอีเมลก่อนใช้งาน ใน email ของท่าน";
    default:
      return "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
  }
}
