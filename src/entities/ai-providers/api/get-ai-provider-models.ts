import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { aiProviderModelsResponseDtoSchema } from "./ai-provider-models-response-schema";
import { type AiProviderModelsResponseDto } from "./types";

export async function getAiProviderModelsDto(
  code: string,
  signal?: AbortSignal
): Promise<AiProviderModelsResponseDto> {
  const response = await fetch(getApiUrl(`ai/providers/${encodeURIComponent(code)}/models`), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`AI provider models request failed with status ${response.status}`);
  }

  const parsedResponse = aiProviderModelsResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "AI provider models response has invalid format"));
  }

  return parsedResponse.data;
}
