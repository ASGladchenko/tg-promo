import { useQuery } from "@tanstack/react-query";

import { getAttemptsWalletDto } from "../api/get-attempts-wallet";
import { mapAttemptsWalletDtoToAttemptsWallet } from "../lib/map-attempts-wallet-dto-to-attempts-wallet";
import { attemptsWalletQueryKey } from "./attempts-wallet-query";

type UseAttemptsWalletOptions = {
  enabled?: boolean;
};

export function useAttemptsWallet({ enabled = true }: UseAttemptsWalletOptions = {}) {
  return useQuery({
    queryKey: attemptsWalletQueryKey,
    queryFn: ({ signal }) => getAttemptsWalletDto(signal),
    select: mapAttemptsWalletDtoToAttemptsWallet,
    enabled
  });
}
