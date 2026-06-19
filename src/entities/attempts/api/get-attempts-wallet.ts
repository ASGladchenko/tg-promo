import { getApiUrl } from "@/shared/api";

import { type AttemptsWalletDto } from "./types";

export async function getAttemptsWalletDto(signal?: AbortSignal): Promise<AttemptsWalletDto> {
  const response = await fetch(getApiUrl("wallet/attempts"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Attempts wallet request failed with status ${response.status}`);
  }

  return response.json() as Promise<AttemptsWalletDto>;
}
