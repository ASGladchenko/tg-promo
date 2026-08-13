import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { gamesCalendarRulesResponseDtoSchema } from "./games-calendar-rules-response-schema";
import { type GamesCalendarRulesResponseDto } from "./types";

export async function getGamesCalendarRulesDto(
  signal?: AbortSignal
): Promise<GamesCalendarRulesResponseDto> {
  const response = await fetch(getApiUrl("games-calendar/rules"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Games calendar rules request failed with status ${response.status}`);
  }

  const parsedResponse = gamesCalendarRulesResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Games calendar rules response has invalid format"));
  }

  return parsedResponse.data;
}
