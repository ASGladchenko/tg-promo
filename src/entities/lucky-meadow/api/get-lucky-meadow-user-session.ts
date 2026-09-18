import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { luckyMeadowUserSessionDetailsDtoSchema } from "./lucky-meadow-user-sessions-response-schema";
import { type GetLuckyMeadowUserSessionParams, type LuckyMeadowUserSessionDetailsDto } from "./types";

export async function getLuckyMeadowUserSessionDto(
  params: GetLuckyMeadowUserSessionParams,
  signal?: AbortSignal
): Promise<LuckyMeadowUserSessionDetailsDto> {
  const searchParams = new URLSearchParams({ startDate: params.startDate });
  const response = await fetch(
    getApiUrl(
      `lucky-meadow/users/${params.userId}/sessions/${params.userSnapshotId}?${searchParams.toString()}`
    ),
    {
      credentials: "include",
      method: "GET",
      signal
    }
  );

  if (!response.ok) {
    throw new Error(`Lucky Meadow user session request failed with status ${response.status}`);
  }

  const parsedResponse = luckyMeadowUserSessionDetailsDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(
      formatZodError(parsedResponse.error, "Lucky Meadow user session response has invalid format")
    );
  }

  return parsedResponse.data;
}
