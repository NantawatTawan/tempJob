import { z } from "zod";

export const AdvertisementSchema = z.object({
  id: z.number(),
  pathname_to_display: z.string(),
  created_at: z.string(),
  image_url: z.string(),
});

export type Advertisement = z.infer<typeof AdvertisementSchema>;
