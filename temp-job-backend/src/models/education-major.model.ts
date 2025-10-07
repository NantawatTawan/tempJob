import { z } from "zod";

export const EducationMajorSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
});

export type EducationMajor = z.infer<typeof EducationMajorSchema>;
