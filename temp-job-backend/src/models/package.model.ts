import { z } from "zod";

export const PackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  life_span_in_months: z.number(),
  jobs_limit: z.number(),
  price: z.number(),
  description: z.string(),
});

export type Package = z.infer<typeof PackageSchema>;
