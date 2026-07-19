import { type CreateAiProviderPayload } from "../api/types";
import { type AdminAiProviderFormState } from "../model/types";

export function mapAdminAiProviderFormToCreatePayload(
  data: AdminAiProviderFormState
): CreateAiProviderPayload {
  return {
    baseUrl: data.baseUrl.trim(),
    code: data.code.trim(),
    name: data.name.trim()
  };
}
