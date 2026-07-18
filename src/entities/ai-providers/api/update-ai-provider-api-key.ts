import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { type UpdateAiProviderApiKeyPayload } from "./types";

export async function updateAiProviderApiKey(
  code: string,
  payload: UpdateAiProviderApiKeyPayload,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(getApiUrl(`ai/providers/${encodeURIComponent(code)}/api-key`), {
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
        `Update AI provider API key request failed with status ${response.status}`
      )
    );
  }
}
