import { type CreatePrizePayload } from "../api/types";
import { type AdminPrizeFormState } from "../model/admin-prize-form-schema";

export function mapAdminPrizeFormToPayload(data: AdminPrizeFormState): CreatePrizePayload {
  const description = data.description.trim();
  const metadataType = data.metadataType.trim();

  const metadata = data.metadata.reduce<Record<string, unknown>>(
    (result, field) => {
      result[field.key.trim()] = field.value.trim();

      return result;
    },
    { type: metadataType }
  );

  return {
    name: data.name.trim(),
    ...(description ? { description } : {}),
    isActive: data.isActive,
    metadata
  };
}
