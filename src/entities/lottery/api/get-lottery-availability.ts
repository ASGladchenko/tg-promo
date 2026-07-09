import { getApiUrl } from "@/shared/api";

import { isLotteryAvailabilityResponseDto } from "./lottery-dto-guards";
import { type LotteryAvailabilityResponseDto } from "./types";

export async function getLotteryAvailabilityDto(
  signal?: AbortSignal
): Promise<LotteryAvailabilityResponseDto> {
  const response = await fetch(getApiUrl("crack-safe/availability"), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal
  });

  if (!response.ok) {
    throw new Error(`Lottery availability request failed with status ${response.status}`);
  }

  const dto: unknown = await response.json();

  if (!isLotteryAvailabilityResponseDto(dto)) {
    throw new Error("Lottery availability returned invalid payload");
  }

  return dto;
}
