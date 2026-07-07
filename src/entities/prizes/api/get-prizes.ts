import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { prizesResponseDtoSchema } from "./prizes-response-schema";
import { type PrizesResponseDto } from "./types";

export async function getPrizesDto(signal?: AbortSignal): Promise<PrizesResponseDto> {
  const response = await fetch(getApiUrl("prizes"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Prizes request failed with status ${response.status}`);
  }

  const parsedResponse = prizesResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Prizes response has invalid format"));
  }

  return parsedResponse.data;
}
