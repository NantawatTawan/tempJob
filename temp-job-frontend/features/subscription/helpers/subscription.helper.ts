import { Subscription } from "../schemas/subscription.schema";

export function hasSubscriptionExpired(
  subscription: Subscription | undefined
): boolean {
  if (!subscription) return false;

  const expiredAt = new Date(subscription.expired_at);

  return expiredAt < new Date();
}
