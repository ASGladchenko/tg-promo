import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { crackSafeRulesResponseDtoSchema } from "./crack-safe-rules-response-schema";
import { type CrackSafeRulesResponseDto } from "./types";

export async function getCrackSafeRulesDto(signal?: AbortSignal): Promise<CrackSafeRulesResponseDto> {
  const response = await fetch(getApiUrl("crack-safe/rules/"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Crack Safe rules request failed with status ${response.status}`);
  }

  const parsedResponse = crackSafeRulesResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Crack Safe rules response has invalid format"));
  }

  return parsedResponse.data;
}
