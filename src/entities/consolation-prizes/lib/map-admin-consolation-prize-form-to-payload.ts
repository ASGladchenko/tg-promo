import { type CreateConsolationPrizePayload, type UpdateConsolationPrizePayload } from "../api/types";
import { type AdminConsolationPrizeDirtyFields, type AdminConsolationPrizeFormState } from "../model/types";

export function mapAdminConsolationPrizeFormToCreatePayload(
  data: AdminConsolationPrizeFormState
): CreateConsolationPrizePayload {
  return {
    prizeId: data.prizeId,
    promoCode: data.promoCode.trim(),
    ...(data.expiresAt ? { expiresAt: data.expiresAt } : {}),
    isActive: data.isActive
  };
}

export function mapAdminConsolationPrizeFormToUpdatePayload(
  data: AdminConsolationPrizeFormState,
  dirtyFields: AdminConsolationPrizeDirtyFields
): UpdateConsolationPrizePayload {
  return {
    ...(dirtyFields.prizeId ? { prizeId: data.prizeId } : {}),
    ...(dirtyFields.promoCode ? { promoCode: data.promoCode.trim() } : {}),
    ...(dirtyFields.expiresAt ? { expiresAt: data.expiresAt || null } : {}),
    ...(dirtyFields.isActive ? { isActive: data.isActive } : {})
  };
}
