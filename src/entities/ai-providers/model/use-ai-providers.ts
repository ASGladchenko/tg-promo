import { useQuery } from "@tanstack/react-query";

import { getAiProvidersDto } from "../api/get-ai-providers";
import { aiProvidersQueryKey } from "./ai-providers-query";

export function useAiProviders() {
  return useQuery({
    queryKey: aiProvidersQueryKey,
    queryFn: ({ signal }) => getAiProvidersDto(signal)
  });
}
