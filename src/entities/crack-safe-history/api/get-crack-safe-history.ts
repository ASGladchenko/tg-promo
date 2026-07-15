import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { crackSafeHistoryResponseDtoSchema } from "./crack-safe-history-response-schema";
import { type CrackSafeHistoryResponseDto } from "./types";

export async function getCrackSafeHistoryDto(signal?: AbortSignal): Promise<CrackSafeHistoryResponseDto> {
  const response = await fetch(getApiUrl("crack-safe/history"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Crack Safe history request failed with status ${response.status}`);
  }

  const parsedResponse = crackSafeHistoryResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Crack Safe history response has invalid format"));
  }

  return parsedResponse.data;
}
