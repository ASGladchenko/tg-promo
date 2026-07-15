import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { crackSafeSnapshotsResponseDtoSchema } from "./crack-safe-snapshots-response-schema";
import { type CrackSafeSnapshotsResponseDto } from "./types";

export async function getCrackSafeSnapshotsDto(signal?: AbortSignal): Promise<CrackSafeSnapshotsResponseDto> {
  const response = await fetch(getApiUrl("crack-safe/snapshots"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Crack Safe snapshots request failed with status ${response.status}`);
  }

  const parsedResponse = crackSafeSnapshotsResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Crack Safe snapshots response has invalid format"));
  }

  return parsedResponse.data;
}
