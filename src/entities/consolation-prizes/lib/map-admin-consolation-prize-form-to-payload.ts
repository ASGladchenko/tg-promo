import { type CreateConsolationPrizePayload, type UpdateConsolationPrizePayload } from "../api/types";
import { type AdminConsolationPrizeDirtyFields, type AdminConsolationPrizeFormState } from "../model/types";
import { adminConsolationPrizeRequiredMetadataLanguageKeys } from "../model/admin-consolation-prize-form-schema";

function mapMetadata(data: AdminConsolationPrizeFormState): Record<string, unknown> {
  const metadataLanguages = Object.fromEntries(
    adminConsolationPrizeRequiredMetadataLanguageKeys.map((key) => [key, data.metadataLanguages[key].trim()])
  );

  return data.metadata.reduce<Record<string, unknown>>((result, field) => {
    result[field.key.trim()] = field.value.trim();

    return result;
  }, metadataLanguages);
}

export function mapAdminConsolationPrizeFormToCreatePayload(
  data: AdminConsolationPrizeFormState
): CreateConsolationPrizePayload {
  const description = data.description.trim();

  return {
    prizeId: data.prizeId,
    promoCode: data.promoCode.trim(),
    ...(description ? { description } : {}),
    metadata: mapMetadata(data),
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
    ...(dirtyFields.metadataLanguages || dirtyFields.metadata ? { metadata: mapMetadata(data) } : {}),
    ...(dirtyFields.expiresAt ? { expiresAt: data.expiresAt || null } : {}),
    ...(dirtyFields.isActive ? { isActive: data.isActive } : {})
  };
}
