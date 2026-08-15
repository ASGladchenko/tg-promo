import { getApiUrl } from "@/shared/api";
import { formatZodError, readResponseErrorMessage } from "@/shared/lib/error";

import { luckyMeadowRuleDtoSchema } from "./lucky-meadow-rules-response-schema";
import { type LuckyMeadowRuleDto, type UpdateLuckyMeadowRulePayload } from "./types";

export async function updateLuckyMeadowRule(
  startDate: string,
  payload: UpdateLuckyMeadowRulePayload,
  signal?: AbortSignal
): Promise<LuckyMeadowRuleDto> {
  const response = await fetch(getApiUrl(`lucky-meadow/rules/${encodeURIComponent(startDate)}`), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Update Lucky Meadow rule request failed with status ${response.status}`
      )
    );
  }

  const parsedResponse = luckyMeadowRuleDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Lucky Meadow rule response has invalid format"));
  }

  return parsedResponse.data;
}
