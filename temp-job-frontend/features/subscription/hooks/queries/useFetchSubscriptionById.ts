import { useQuery } from "@tanstack/react-query";
import { Subscription } from "../../schemas/subscription.schema";
import { subscriptionService } from "../../services/subscription.service";

export function useFetchSubscriptionById(
  subscriptionId: Subscription["id"] | null | undefined
) {
  return useQuery({
    queryKey: ["subscription", subscriptionId],
    queryFn: async () => {
      if (!subscriptionId) {
        return null;
      }

      const subscription = await subscriptionService.getSubscriptionById(
        subscriptionId
      );

      return subscription;
    },
    enabled: Boolean(subscriptionId),
    retry: false,
  });
}
