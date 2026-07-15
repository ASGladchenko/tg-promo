import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { crackSafeSnapshotCodesResponseDtoSchema } from "./crack-safe-snapshot-codes-response-schema";
import { type CrackSafeSnapshotCodesResponseDto } from "./types";

export async function getCrackSafeSnapshotCodesDto(
  gameDate: string,
  signal?: AbortSignal
): Promise<CrackSafeSnapshotCodesResponseDto> {
  const response = await fetch(getApiUrl(`crack-safe/snapshots/${encodeURIComponent(gameDate)}/codes`), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Crack Safe snapshot codes request failed with status ${response.status}`);
  }

  const parsedResponse = crackSafeSnapshotCodesResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(
      formatZodError(parsedResponse.error, "Crack Safe snapshot codes response has invalid format")
    );
  }

  return parsedResponse.data;
}
