import { z } from "zod";

export const EducationMajorSchema = z.object({
  id: z.number(),
  title: z.string().min(1, { message: "กรุณากรอกชื่อสาขาวิชา" }),
  description: z.string(),
});

export type EducationMajor = z.infer<typeof EducationMajorSchema>;
