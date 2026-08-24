import { getApiUrl } from "@/shared/api";

import { type LuckyMeadowStartResult } from "../model/types";
import { isStartLuckyMeadowSnapshotResponseDto } from "./lucky-meadow-dto-guards";

export async function startLuckyMeadowSnapshot(signal?: AbortSignal): Promise<LuckyMeadowStartResult> {
  const response = await fetch(getApiUrl("lucky-meadow/user-snapshots"), {
    method: "POST",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Lucky Meadow start request failed with status ${response.status}`);
  }

  const dto: unknown = await response.json();

  if (!isStartLuckyMeadowSnapshotResponseDto(dto)) {
    throw new Error("Lucky Meadow start returned invalid payload");
  }

  return dto;
}
