import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { type CreateAiProviderPayload } from "./types";

export async function createAiProvider(payload: CreateAiProviderPayload, signal?: AbortSignal): Promise<void> {
  const response = await fetch(getApiUrl("ai/providers"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(response, `Create AI provider request failed with status ${response.status}`)
    );
  }
}
