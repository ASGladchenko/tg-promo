import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

import { consolationPrizeDtoSchema } from "./consolation-prizes-response-schema";
import { type ConsolationPrizeDto, type CreateConsolationPrizePayload } from "./types";

export async function createConsolationPrize(
  payload: CreateConsolationPrizePayload,
  signal?: AbortSignal
): Promise<ConsolationPrizeDto> {
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

  const parsedResponse = consolationPrizeDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw parsedResponse.error;
  }

  return parsedResponse.data;
}
