import { z } from "zod";

export const SubscriptionSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  expired_at: z.string(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;
