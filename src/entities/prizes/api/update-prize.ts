import { getApiUrl } from "@/shared/api";

import { type UpdatePrizePayload } from "./types";

export async function updatePrize(id: string, payload: UpdatePrizePayload, signal?: AbortSignal): Promise<void> {
  const response = await fetch(getApiUrl(`prizes/${encodeURIComponent(id)}`), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(`Update prize request failed with status ${response.status}`);
  }
}
