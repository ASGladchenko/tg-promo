import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { luckyMeadowSnapshotStatsResponseDtoSchema } from "./lucky-meadow-snapshot-stats-response-schema";
import { type LuckyMeadowSnapshotStatsDto } from "./types";

export async function getLuckyMeadowSnapshotStatsDto(
  startDate: string,
  signal?: AbortSignal
): Promise<LuckyMeadowSnapshotStatsDto> {
  const response = await fetch(getApiUrl(`lucky-meadow/snapshots/${encodeURIComponent(startDate)}/stats`), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Lucky Meadow snapshot stats request failed with status ${response.status}`);
  }

  const parsedResponse = luckyMeadowSnapshotStatsResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(
      formatZodError(parsedResponse.error, "Lucky Meadow snapshot stats response has invalid format")
    );
  }

  return parsedResponse.data;
}
