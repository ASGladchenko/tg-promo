import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { type UpdateAiProviderStatusPayload } from "./types";

export async function updateAiProviderStatus(
  code: string,
  payload: UpdateAiProviderStatusPayload,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(getApiUrl(`ai/providers/${encodeURIComponent(code)}/status`), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Update AI provider status request failed with status ${response.status}`
      )
    );
  }
}
