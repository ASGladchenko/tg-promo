import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAiProvider } from "../api/create-ai-provider";
import { type CreateAiProviderPayload } from "../api/types";
import { aiProvidersQueryKey } from "./ai-providers-query";

export function useCreateAiProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAiProviderPayload) => createAiProvider(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aiProvidersQueryKey });
    }
  });
}
