export const HIRE_TYP_OPTIONS = [
  { value: "", label: "เลือกเงื่อนไขการจ่ายค่าจ้าง" },
  { value: "งานเหมา", label: "งานเหมา" },
  { value: "รายชั่วโมง", label: "รายชั่วโมง" },
  { value: "รายวัน", label: "รายวัน" },
  { value: "รายเดือน", label: "รายเดือน" },
  {
    value: "งานรับจ๊อบชั่วคราว",
    label: "งานรับจ๊อบชั่วคราว",
  },
  { value: "อื่นๆ", label: "อื่นๆ" },
];
export const DRIVING_LICENSE_OPTIONS = [
  { value: "not_required", label: "ไม่มี" },

  // ส่วนบุคคล
  { value: "motorcycle", label: "รถจักรยานยนต์" },
  { value: "car_private", label: "รถยนต์" },

  // สาธารณะ/พาณิชย์
  { value: "car_public", label: "รถยนต์สาธารณะ / แท็กซี่" },
  { value: "bus", label: "รถโดยสารสาธารณะ (รถตู้/รถบัส)" },
  { value: "truck", label: "รถบรรทุก" },
  { value: "trailer", label: "รถพ่วง / รถลากจูง" },

  // เฉพาะกิจ
  { value: "tractor", label: "รถแทรกเตอร์ / งานเกษตร" },
];
