import { useQuery } from "@tanstack/react-query";

import { getAiProviderModelsDto } from "../api/get-ai-provider-models";
import { aiProviderModelsQueryKey } from "./ai-providers-query";

type UseAiProviderModelsOptions = {
  enabled?: boolean;
};

export function useAiProviderModels(code: string, { enabled = true }: UseAiProviderModelsOptions = {}) {
  return useQuery({
    queryKey: aiProviderModelsQueryKey(code),
    queryFn: ({ signal }) => getAiProviderModelsDto(code, signal),
    enabled
  });
}
