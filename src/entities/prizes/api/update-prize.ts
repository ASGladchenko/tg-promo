import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

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
    throw new Error(
      await readResponseErrorMessage(response, `Update prize request failed with status ${response.status}`)
    );
  }
}
