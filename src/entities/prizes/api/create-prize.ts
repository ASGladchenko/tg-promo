import { getApiUrl } from "@/shared/api";

import { type CreatePrizePayload } from "./types";

export async function createPrize(payload: CreatePrizePayload, signal?: AbortSignal): Promise<void> {
  const response = await fetch(getApiUrl("prizes/create"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(`Create prize request failed with status ${response.status}`);
  }
}
