import { getApiUrl } from "@/shared/api";
import { formatZodError, readResponseErrorMessage } from "@/shared/lib/error";

import { walletAttemptRewardsSettingsResponseDtoSchema } from "./wallet-attempt-rewards-settings-response-schema";
import {
  type UpdateWalletAttemptRewardsSettingsPayload,
  type WalletAttemptRewardsSettingsResponseDto
} from "./types";

export async function updateWalletAttemptRewardsSettings(
  payload: UpdateWalletAttemptRewardsSettingsPayload,
  signal?: AbortSignal
): Promise<WalletAttemptRewardsSettingsResponseDto> {
  const response = await fetch(getApiUrl("settings/wallet/attempt-rewards"), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Update wallet attempt rewards settings request failed with status ${response.status}`
      )
    );
  }

  const parsedResponse = walletAttemptRewardsSettingsResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(
      formatZodError(
        parsedResponse.error,
        "Update wallet attempt rewards settings response has invalid format"
      )
    );
  }

  return parsedResponse.data;
}
