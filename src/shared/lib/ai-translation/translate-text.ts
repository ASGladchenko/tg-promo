import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import {
  aiTranslateTextPayloadSchema,
  aiTranslateTextResponseSchema,
  type AiTranslateTextPayload
} from "./ai-translation-schemas";

export async function translateText(payload: AiTranslateTextPayload, signal?: AbortSignal) {
  const parsedPayload = aiTranslateTextPayloadSchema.parse(payload);

  const response = await fetch(getApiUrl("ai/translate"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(parsedPayload),
    signal
  });

  if (!response.ok) {
    throw new Error(`AI translate request failed with status ${response.status}`);
  }

  const parsedResponse = aiTranslateTextResponseSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "AI translate response has invalid format"));
  }

  return parsedResponse.data.translations;
}
