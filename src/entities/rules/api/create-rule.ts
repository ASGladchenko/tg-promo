import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { type CreateRulePayload } from "./types";

export async function createRule(payload: CreateRulePayload, signal?: AbortSignal): Promise<void> {
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
      throw new Error("Rules cannot be created for today.");
    }

    throw new Error(
      await readResponseErrorMessage(response, `Create rule request failed with status ${response.status}`)
    );
  }
}
