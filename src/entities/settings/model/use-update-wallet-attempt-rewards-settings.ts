import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateWalletAttemptRewardsSettings } from "../api/update-wallet-attempt-rewards-settings";
import { type UpdateWalletAttemptRewardsSettingsPayload } from "../api/types";
import { walletAttemptRewardsSettingsQueryKey } from "./settings-query";

export function useUpdateWalletAttemptRewardsSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWalletAttemptRewardsSettingsPayload) =>
      updateWalletAttemptRewardsSettings(payload),
    onSuccess: (settings) => {
      queryClient.setQueryData(walletAttemptRewardsSettingsQueryKey, settings);
    }
  });
}
