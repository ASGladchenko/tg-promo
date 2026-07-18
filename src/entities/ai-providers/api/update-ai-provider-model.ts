import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { type UpdateAiProviderModelPayload } from "./types";

export async function updateAiProviderModel(
  code: string,
  payload: UpdateAiProviderModelPayload,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(getApiUrl(`ai/providers/${encodeURIComponent(code)}/model`), {
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
      await readResponseErrorMessage(response, `Update AI provider model request failed with status ${response.status}`)
    );
  }
}
