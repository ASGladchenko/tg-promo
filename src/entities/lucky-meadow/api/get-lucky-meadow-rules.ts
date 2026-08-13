import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { luckyMeadowRulesResponseDtoSchema } from "./lucky-meadow-rules-response-schema";
import { type LuckyMeadowRulesResponseDto } from "./types";

export async function getLuckyMeadowRulesDto(signal?: AbortSignal): Promise<LuckyMeadowRulesResponseDto> {
  const response = await fetch(getApiUrl("lucky-meadow/rules"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Lucky Meadow rules request failed with status ${response.status}`);
  }

  const parsedResponse = luckyMeadowRulesResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Lucky Meadow rules response has invalid format"));
  }

  return parsedResponse.data;
}
