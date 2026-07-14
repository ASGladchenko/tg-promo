import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { type UpdateCrackSafeRulePayload } from "./types";

export async function updateCrackSafeRule(
  date: string,
  payload: UpdateCrackSafeRulePayload,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(getApiUrl(`crack-safe/rules/${encodeURIComponent(date)}`), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Today's Crack Safe rules cannot be edited.");
    }

    throw new Error(
      await readResponseErrorMessage(
        response,
        `Update Crack Safe rule request failed with status ${response.status}`
      )
    );
  }
}
