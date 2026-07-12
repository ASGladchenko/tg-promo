import {
  type CreateConsolationPrizePayload,
  type UpdateConsolationPrizePayload
} from "../api/types";
import {
  type AdminConsolationPrizeDirtyFields,
  type AdminConsolationPrizeFormState
} from "../model/types";

export function mapAdminConsolationPrizeFormToCreatePayload(
  data: AdminConsolationPrizeFormState
): CreateConsolationPrizePayload {
  const description = data.description.trim();

  return {
    prizeId: data.prizeId,
    promoCode: data.promoCode.trim(),
    ...(description ? { description } : {}),
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
    ...(dirtyFields.description ? { description: data.description.trim() } : {}),
    ...(dirtyFields.expiresAt ? { expiresAt: data.expiresAt || null } : {}),
    ...(dirtyFields.isActive ? { isActive: data.isActive } : {})
  };
}
