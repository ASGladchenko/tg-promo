import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { luckyMeadowPeriodUsersResponseDtoSchema } from "./lucky-meadow-period-users-response-schema";
import { type GetLuckyMeadowPeriodUsersParams, type LuckyMeadowPeriodUsersResponseDto } from "./types";

export async function getLuckyMeadowPeriodUsersDto(
  params: GetLuckyMeadowPeriodUsersParams,
  signal?: AbortSignal
): Promise<LuckyMeadowPeriodUsersResponseDto> {
  const searchParams = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
    search: params.search,
    startDate: params.startDate
  });
  const response = await fetch(getApiUrl(`lucky-meadow/users?${searchParams.toString()}`), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Lucky Meadow users request failed with status ${response.status}`);
  }

  const parsedResponse = luckyMeadowPeriodUsersResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Lucky Meadow users response has invalid format"));
  }

  return parsedResponse.data;
}
