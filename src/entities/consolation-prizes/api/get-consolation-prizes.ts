import { getApiUrl } from "@/shared/api";

import { consolationPrizesResponseDtoSchema } from "./consolation-prizes-response-schema";
import { type ConsolationPrizesResponseDto } from "./types";

export async function getConsolationPrizesDto(signal?: AbortSignal): Promise<ConsolationPrizesResponseDto> {
  const response = await fetch(getApiUrl("consolation-prizes"), {
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Consolation prizes request failed with status ${response.status}`);
  }

  const parsedResponse = consolationPrizesResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw parsedResponse.error;
  }

  return parsedResponse.data;
}
