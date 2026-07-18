import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAiProviderApiKey } from "../api/update-ai-provider-api-key";
import { type UpdateAiProviderApiKeyPayload } from "../api/types";
import { aiProvidersQueryKey } from "./ai-providers-query";

type UpdateAiProviderApiKeyVariables = {
  code: string;
  payload: UpdateAiProviderApiKeyPayload;
};

export function useUpdateAiProviderApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, payload }: UpdateAiProviderApiKeyVariables) => updateAiProviderApiKey(code, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aiProvidersQueryKey });
    }
  });
}
