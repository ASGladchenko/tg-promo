import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { crackSafeRuleDtoSchema } from "./crack-safe-rules-response-schema";
import { type CrackSafeRuleDto } from "./types";

export async function getCrackSafeRule(startDate: string, signal?: AbortSignal): Promise<CrackSafeRuleDto> {
  const response = await fetch(getApiUrl(`crack-safe/rules/${encodeURIComponent(startDate)}`), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Crack Safe rule request failed with status ${response.status}`);
  }

  const parsedResponse = crackSafeRuleDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Crack Safe rule response has invalid format"));
  }

  return parsedResponse.data;
}
