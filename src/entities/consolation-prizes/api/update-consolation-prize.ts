import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { type UpdateConsolationPrizePayload } from "./types";

export async function updateConsolationPrize(
  id: string,
  payload: UpdateConsolationPrizePayload,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(getApiUrl(`consolation-prizes/${encodeURIComponent(id)}`), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Update consolation prize request failed with status ${response.status}`
      )
    );
  }
}
