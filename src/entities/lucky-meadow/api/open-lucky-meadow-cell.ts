import { getApiUrl } from "@/shared/api";

import { mapOpenLuckyMeadowCellDtoToOpenLuckyMeadowCellResult } from "../lib/map-lucky-meadow-dto-to-lucky-meadow";
import { type LuckyMeadowOpenCellResult } from "../model/types";
import { isOpenLuckyMeadowCellResponseDto } from "./lucky-meadow-dto-guards";
import { type OpenLuckyMeadowCellPayload } from "./types";

export async function openLuckyMeadowCell(
  userSnapshotId: string,
  payload: OpenLuckyMeadowCellPayload,
  signal?: AbortSignal
): Promise<LuckyMeadowOpenCellResult> {
  const response = await fetch(getApiUrl(`lucky-meadow/user-snapshots/${userSnapshotId}/open-cell`), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(`Lucky Meadow cell open request failed with status ${response.status}`);
  }

  const dto: unknown = await response.json();

  if (!isOpenLuckyMeadowCellResponseDto(dto)) {
    throw new Error("Lucky Meadow cell open returned invalid payload");
  }

  return mapOpenLuckyMeadowCellDtoToOpenLuckyMeadowCellResult(dto);
}
