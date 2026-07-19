import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { aiProvidersResponseDtoSchema } from "./ai-providers-response-schema";
import { type AiProvidersResponseDto } from "./types";

export async function getAiProvidersDto(signal?: AbortSignal): Promise<AiProvidersResponseDto> {
  const response = await fetch(getApiUrl("ai/providers"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`AI providers request failed with status ${response.status}`);
  }

  const parsedResponse = aiProvidersResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "AI providers response has invalid format"));
  }

  return parsedResponse.data;
}
