import { useQuery } from "@tanstack/react-query";

import { getWalletAttemptRewardsSettingsDto } from "../api/get-wallet-attempt-rewards-settings";
import { walletAttemptRewardsSettingsQueryKey } from "./settings-query";

const WALLET_ATTEMPT_REWARDS_REFETCH_INTERVAL_MS = 5 * 60 * 1000;

export function useWalletAttemptRewardsSettings() {
  return useQuery({
    queryKey: walletAttemptRewardsSettingsQueryKey,
    queryFn: ({ signal }) => getWalletAttemptRewardsSettingsDto(signal),
    refetchInterval: WALLET_ATTEMPT_REWARDS_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: "always",
    staleTime: WALLET_ATTEMPT_REWARDS_REFETCH_INTERVAL_MS
  });
}
