import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAttemptsWalletDto } from "../api/get-attempts-wallet";
import { mapAttemptsWalletDtoToAttemptsWallet } from "../lib/map-attempts-wallet-dto-to-attempts-wallet";
import { applyAttemptsWalletQueryData, attemptsWalletQueryKey } from "./attempts-wallet-query";

type UseAttemptsWalletOptions = {
  enabled?: boolean;
};

export function useAttemptsWallet({ enabled = true }: UseAttemptsWalletOptions = {}) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: attemptsWalletQueryKey,
    queryFn: async ({ signal }) => {
      const dto = await getAttemptsWalletDto(signal);

      return applyAttemptsWalletQueryData(queryClient, dto).dto;
    },
    select: mapAttemptsWalletDtoToAttemptsWallet,
    enabled
  });
}
