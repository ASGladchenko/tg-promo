import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { type CreateCrackSafeRulePayload } from "./types";

export async function createCrackSafeRule(
  payload: CreateCrackSafeRulePayload,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(getApiUrl("crack-safe/rules"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Crack Safe rules cannot be created for today.");
    }

    throw new Error(
      await readResponseErrorMessage(
        response,
        `Create Crack Safe rule request failed with status ${response.status}`
      )
    );
  }
}
