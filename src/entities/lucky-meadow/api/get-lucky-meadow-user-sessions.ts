import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { luckyMeadowUserSessionsResponseDtoSchema } from "./lucky-meadow-user-sessions-response-schema";
import { type GetLuckyMeadowUserSessionsParams, type LuckyMeadowUserSessionsResponseDto } from "./types";

export async function getLuckyMeadowUserSessionsDto(
  params: GetLuckyMeadowUserSessionsParams,
  signal?: AbortSignal
): Promise<LuckyMeadowUserSessionsResponseDto> {
  const searchParams = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
    startDate: params.startDate
  });
  const response = await fetch(
    getApiUrl(`lucky-meadow/users/${params.userId}/sessions?${searchParams.toString()}`),
    {
      credentials: "include",
      method: "GET",
      signal
    }
  );

  if (!response.ok) {
    throw new Error(`Lucky Meadow user sessions request failed with status ${response.status}`);
  }

  const parsedResponse = luckyMeadowUserSessionsResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(
      formatZodError(parsedResponse.error, "Lucky Meadow user sessions response has invalid format")
    );
  }

  return parsedResponse.data;
}
