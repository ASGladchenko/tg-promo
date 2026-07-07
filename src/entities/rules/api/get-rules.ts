import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { rulesResponseDtoSchema } from "./rules-response-schema";
import { type RulesResponseDto } from "./types";

export async function getRulesDto(signal?: AbortSignal): Promise<RulesResponseDto> {
  const response = await fetch(getApiUrl("crack-safe/rules/"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Rules request failed with status ${response.status}`);
  }

  const parsedResponse = rulesResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Rules response has invalid format"));
  }

  return parsedResponse.data;
}
