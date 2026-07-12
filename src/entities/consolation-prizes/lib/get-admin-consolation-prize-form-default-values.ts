import { type AdminConsolationPrizeFormState, type ConsolationPrize } from "../model/types";

export function getAdminConsolationPrizeFormDefaultValues(
  prize?: ConsolationPrize
): AdminConsolationPrizeFormState {
  return prize
    ? {
        prizeId: prize.prizeId,
        promoCode: prize.promoCode,
        description: prize.description,
        expiresAt: prize.expiresAt?.slice(0, 10) ?? "",
        isActive: prize.isActive
      }
    : { prizeId: "", promoCode: "", description: "", expiresAt: "", isActive: true };
}
