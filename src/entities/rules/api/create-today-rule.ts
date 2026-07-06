import { getApiUrl } from "@/shared/api";

import { type CreateTodayRulePayload } from "./types";

export async function createTodayRule(payload: CreateTodayRulePayload, signal?: AbortSignal): Promise<void> {
  const response = await fetch(getApiUrl("crack-safe/dev-rules/today"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(`Create today rule request failed with status ${response.status}`);
  }
}
