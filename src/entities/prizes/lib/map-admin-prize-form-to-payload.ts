import { type CreatePrizePayload } from "../api/types";
import { adminPrizeRequiredMetadataLanguageKeys } from "../model/admin-prize-form-schema";
import { type AdminPrizeFormState } from "../model/types";

export function mapAdminPrizeFormToPayload(data: AdminPrizeFormState): CreatePrizePayload {
  const description = data.description.trim();
  const metadataLanguages = Object.fromEntries(
    adminPrizeRequiredMetadataLanguageKeys.map((key) => [key, data.metadataLanguages[key].trim()])
  );

  const metadata = data.metadata.reduce<Record<string, unknown>>(
    (result, field) => {
      result[field.key.trim()] = field.value.trim();

      return result;
    },
    { type: "promo", ...metadataLanguages }
  );

  return {
    name: data.name.trim(),
    ...(description ? { description } : {}),
    isActive: data.isActive,
    metadata
  };
}
