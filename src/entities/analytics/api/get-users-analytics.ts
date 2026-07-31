import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { type UsersAnalyticsRange } from "../model/types";
import { usersAnalyticsResponseDtoSchema } from "./users-analytics-response-schema";
import { type UsersAnalyticsResponseDto } from "./types";

export async function getUsersAnalyticsDto(
  range: UsersAnalyticsRange,
  signal?: AbortSignal
): Promise<UsersAnalyticsResponseDto> {
  const searchParams = new URLSearchParams(range);
  const response = await fetch(getApiUrl(`analytics/users?${searchParams.toString()}`), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Users analytics request failed with status ${response.status}`);
  }

  const parsedResponse = usersAnalyticsResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Users analytics response has invalid format"));
  }

  return parsedResponse.data;
}
