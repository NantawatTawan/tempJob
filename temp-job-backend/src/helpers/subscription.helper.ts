import { getLocalTimeZone, today } from "@internationalized/date";
import { Subscription } from "../models/subscription.model";
import { parseCalendarDate } from "./date.helper";

export function hasSubscriptionExpired(subscription: Subscription): boolean {
  const expiredDate = new Date(subscription.expired_at);

  return today(getLocalTimeZone()).compare(parseCalendarDate(expiredDate)) > 0;
}
