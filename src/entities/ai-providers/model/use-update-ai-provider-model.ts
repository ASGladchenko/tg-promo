import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAiProviderModel } from "../api/update-ai-provider-model";
import { type UpdateAiProviderModelPayload } from "../api/types";
import { aiProvidersQueryKey } from "./ai-providers-query";

type UpdateAiProviderModelVariables = {
  code: string;
  payload: UpdateAiProviderModelPayload;
};

export function useUpdateAiProviderModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, payload }: UpdateAiProviderModelVariables) => updateAiProviderModel(code, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aiProvidersQueryKey });
    }
  });
}
