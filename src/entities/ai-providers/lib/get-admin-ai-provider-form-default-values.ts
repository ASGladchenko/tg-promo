import { type AdminAiProviderFormState } from "../model/types";

export function getAdminAiProviderFormDefaultValues(): AdminAiProviderFormState {
  return {
    baseUrl: "",
    code: "",
    name: ""
  };
}
