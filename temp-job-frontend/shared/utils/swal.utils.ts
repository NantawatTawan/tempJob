import Swal from "sweetalert2";

export const SWAL_COLORS = {
  confirm: '#10b981',
  cancel: '#ef4444', 
}

export const showSuccessAlert = (message: string) => {
  return Swal.fire({
    icon: "success",
    title: "สำเร็จ",
    text: message,
    confirmButtonColor: SWAL_COLORS.confirm,
    confirmButtonText: 'ตกลง'
  });
};

export const showErrorAlert = (message: string) => {
  return Swal.fire({
    icon: "error",
    title: "เกิดข้อผิดพลาด",
    text: message,
    confirmButtonColor: SWAL_COLORS.confirm,
    confirmButtonText: 'ตกลง'
  });
};

export const showConfirmationAlert = (title: string, message: string) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: SWAL_COLORS.confirm,
    cancelButtonColor: SWAL_COLORS.cancel,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก"
  });
}; 