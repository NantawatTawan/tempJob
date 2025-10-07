import { MembershipTier } from "../schemas/membership.schema";

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: "bronze-tier",
    name: "Bronze",
    icon: "fa-solid fa-award text-amber-700",
    pointsRequired: 0,
    benefits: ["ส่วนลด 5% สำหรับแพ็กเกจรายปี", "ประกาศงาน 10 ตำแหน่ง"],
  },
  {
    id: "silver-tier",
    name: "Silver",
    icon: "fa-solid fa-medal text-gray-400",
    pointsRequired: 50,
    benefits: ["ส่วนลด 10% สำหรับแพ็กเกจรายปี", "ประกาศงาน 30 ตำแหน่ง"],
  },
  {
    id: "gold-tier",
    name: "Gold",
    icon: "fa-solid fa-crown text-yellow-500",
    pointsRequired: 100,
    benefits: ["ส่วนลด 15% สำหรับแพ็กเกจรายปี", "ประกาศงาน 50 ตำแหน่ง"],
  },
  {
    id: "platinum-tier",
    name: "Platinum",
    icon: "fa-solid fa-gem text-purple-500",
    pointsRequired: 200,
    benefits: [
      "ส่วนลด 20% สำหรับแพ็กเกจรายปี",
      "ประกาศงานไม่จำกัด",
      "แสดงผลอันดับต้นๆ",
    ],
  },
];
