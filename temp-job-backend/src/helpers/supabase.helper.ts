export function translateSupabaseErrorMessage(
  entity: string,
  errorMessage: string
): string {
  switch (errorMessage) {
    case "JSON object requested, multiple (or no) rows returned":
      return `ไม่พบข้อมูล ${entity}`;
    case "A user with this email address has already been registered":
      return `อีเมลนี้ถูกใช้งานแล้ว`;
    case `duplicate key value violates unique constraint "freelancer_interesting_job_type_pkey"`:
      return `คุณได้เพิ่มงานที่สนใจนี้ไปแล้ว`;
    default:
      return errorMessage;
  }
}

export function isNotFoundError(errorMessage: string): boolean {
  return errorMessage.includes(
    "JSON object requested, multiple (or no) rows returned"
  );
}
