import { getApiUrl } from "@/shared/api";
import { formatZodError, readResponseErrorMessage } from "@/shared/lib/error";

import { luckyMeadowRuleDtoSchema } from "./lucky-meadow-rules-response-schema";
import { type CreateLuckyMeadowRulePayload, type LuckyMeadowRuleDto } from "./types";

export async function createLuckyMeadowRule(
  payload: CreateLuckyMeadowRulePayload,
  signal?: AbortSignal
): Promise<LuckyMeadowRuleDto> {
  const response = await fetch(getApiUrl("lucky-meadow/rules"), {
    method: "POST",
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
        `Create Lucky Meadow rule request failed with status ${response.status}`
      )
    );
  }

  const parsedResponse = luckyMeadowRuleDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Lucky Meadow rule response has invalid format"));
  }

  return parsedResponse.data;
}
