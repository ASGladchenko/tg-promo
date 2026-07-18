import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAiProviderStatus } from "../api/update-ai-provider-status";
import { type UpdateAiProviderStatusPayload } from "../api/types";
import { aiProvidersQueryKey } from "./ai-providers-query";

type UpdateAiProviderStatusVariables = {
  code: string;
  payload: UpdateAiProviderStatusPayload;
};

export function useUpdateAiProviderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, payload }: UpdateAiProviderStatusVariables) => updateAiProviderStatus(code, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aiProvidersQueryKey });
    }
  });
}
