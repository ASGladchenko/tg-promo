import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { gameSchedulesResponseDtoSchema } from "./game-schedules-response-schema";
import { type GameSchedulesResponseDto } from "./types";

export async function getGameSchedules(month: string, signal?: AbortSignal): Promise<GameSchedulesResponseDto> {
  const response = await fetch(getApiUrl(`game-schedules?month=${encodeURIComponent(month)}`), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Game schedules request failed with status ${response.status}`);
  }

  const parsedResponse = gameSchedulesResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Game schedules response has invalid format"));
  }

  return parsedResponse.data;
}
