import { getApiUrl } from "@/shared/api";

import { isLuckyMeadowStateResponseDto } from "./lucky-meadow-dto-guards";
import { type LuckyMeadowStateResponseDto } from "./types";

export async function getLuckyMeadowStateDto(signal?: AbortSignal): Promise<LuckyMeadowStateResponseDto> {
  const response = await fetch(getApiUrl("lucky-meadow/state"), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal
  });

  if (!response.ok) {
    throw new Error(`Lucky Meadow state request failed with status ${response.status}`);
  }

  const dto: unknown = await response.json();

  if (!isLuckyMeadowStateResponseDto(dto)) {
    throw new Error("Lucky Meadow state returned invalid payload");
  }

  return dto;
}
