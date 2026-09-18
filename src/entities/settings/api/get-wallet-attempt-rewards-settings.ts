import { getApiUrl } from "@/shared/api";
import { formatZodError, readResponseErrorMessage } from "@/shared/lib/error";

import { walletAttemptRewardsSettingsResponseDtoSchema } from "./wallet-attempt-rewards-settings-response-schema";
import { type WalletAttemptRewardsSettingsResponseDto } from "./types";

export async function getWalletAttemptRewardsSettingsDto(
  signal?: AbortSignal
): Promise<WalletAttemptRewardsSettingsResponseDto> {
  const response = await fetch(getApiUrl("settings/wallet/attempt-rewards"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Wallet attempt rewards settings request failed with status ${response.status}`
      )
    );
  }

  const parsedResponse = walletAttemptRewardsSettingsResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(
      formatZodError(parsedResponse.error, "Wallet attempt rewards settings response has invalid format")
    );
  }

  return parsedResponse.data;
}
