import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { luckyMeadowRuleDtoSchema } from "./lucky-meadow-rules-response-schema";
import { type LuckyMeadowRuleDto } from "./types";

export async function getLuckyMeadowRule(startDate: string, signal?: AbortSignal): Promise<LuckyMeadowRuleDto> {
  const response = await fetch(getApiUrl(`lucky-meadow/rules/${encodeURIComponent(startDate)}`), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Lucky Meadow rule request failed with status ${response.status}`);
  }

  const parsedResponse = luckyMeadowRuleDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Lucky Meadow rule response has invalid format"));
  }

  return parsedResponse.data;
}
