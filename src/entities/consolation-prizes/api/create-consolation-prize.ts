import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { type CreateConsolationPrizePayload } from "./types";

export async function createConsolationPrize(
  payload: CreateConsolationPrizePayload,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(getApiUrl("consolation-prizes/create"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Create consolation prize request failed with status ${response.status}`
      )
    );
  }
}
