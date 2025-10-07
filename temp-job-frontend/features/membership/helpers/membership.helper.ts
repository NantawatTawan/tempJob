import { MEMBERSHIP_TIERS } from "../constants/membership.constant";
import { MembershipTier } from "../schemas/membership.schema";

export function getCurrentTier(currentPoints: number): MembershipTier {
  const bronzeTier = MEMBERSHIP_TIERS.find((tier) => tier.id === "bronze-tier");

  return (
    MEMBERSHIP_TIERS.findLast((tier) => currentPoints >= tier.pointsRequired) ??
    bronzeTier!
  );
}

export function getCurrentTierIndex(currentPoints: number): number {
  const currentTier = getCurrentTier(currentPoints);
  return MEMBERSHIP_TIERS.findIndex((tier) => tier.id === currentTier.id);
}

export function getNextTier(currentPoints: number): MembershipTier | null {
  const currentTierIndex = getCurrentTierIndex(currentPoints);

  return MEMBERSHIP_TIERS[currentTierIndex + 1] ?? null;
}

export function getRemainingPointsFromNextTier(currentPoints: number): number {
  const nextTier = getNextTier(currentPoints);

  if (!nextTier) return 0;

  return nextTier.pointsRequired - currentPoints;
}

export function getProgressPercentageToNextTier(currentPoints: number): number {
  const nextTier = getNextTier(currentPoints);

  if (!nextTier) return 0;

  return (currentPoints / nextTier.pointsRequired) * 100;
}
