import { z } from "zod";

export const EducationLevelSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  power: z.number(),
});

export type EducationLevel = z.infer<typeof EducationLevelSchema>;
