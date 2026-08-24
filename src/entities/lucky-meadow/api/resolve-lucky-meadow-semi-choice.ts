import { getApiUrl } from "@/shared/api";

import { mapResolveLuckyMeadowSemiChoiceDtoToLuckyMeadowSemiChoiceResult } from "../lib/map-lucky-meadow-dto-to-lucky-meadow";
import { type LuckyMeadowSemiChoiceResult } from "../model/types";
import { isResolveLuckyMeadowSemiChoiceResponseDto } from "./lucky-meadow-dto-guards";
import { type ResolveLuckyMeadowSemiChoicePayload } from "./types";

export async function resolveLuckyMeadowSemiChoice(
  userSnapshotId: string,
  payload: ResolveLuckyMeadowSemiChoicePayload,
  signal?: AbortSignal
): Promise<LuckyMeadowSemiChoiceResult> {
  const response = await fetch(getApiUrl(`lucky-meadow/user-snapshots/${userSnapshotId}/semi-choice`), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(`Lucky Meadow semi choice request failed with status ${response.status}`);
  }

  const dto: unknown = await response.json();

  if (!isResolveLuckyMeadowSemiChoiceResponseDto(dto)) {
    throw new Error("Lucky Meadow semi choice returned invalid payload");
  }

  return mapResolveLuckyMeadowSemiChoiceDtoToLuckyMeadowSemiChoiceResult(dto);
}
