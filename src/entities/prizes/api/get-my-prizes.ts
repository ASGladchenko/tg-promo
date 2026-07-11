import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { myPrizesResponseDtoSchema } from "./prizes-response-schema";
import { type MyPrizesResponseDto } from "./types";

export async function getMyPrizesDto(signal?: AbortSignal): Promise<MyPrizesResponseDto> {
  const response = await fetch(getApiUrl("prizes/me"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`My prizes request failed with status ${response.status}`);
  }

  const parsedResponse = myPrizesResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "My prizes response has invalid format"));
  }

  return parsedResponse.data;
}
