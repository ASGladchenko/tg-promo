import { type QueryClient } from "@tanstack/react-query";

import { type AttemptsWalletDto } from "../api/types";
import { mapAttemptsWalletDtoToAttemptsWallet } from "../lib/map-attempts-wallet-dto-to-attempts-wallet";
import { type AttemptsWallet } from "./types";

export const attemptsWalletQueryKey = ["attempts", "wallet"] as const;

export type AttemptsWalletQueryUpdateResult = {
  dto: AttemptsWalletDto;
  isApplied: boolean;
  wallet: AttemptsWallet;
};

export function applyAttemptsWalletQueryData(
  queryClient: QueryClient,
  dto: AttemptsWalletDto
): AttemptsWalletQueryUpdateResult {
  const currentDto = queryClient.getQueryData<AttemptsWalletDto>(attemptsWalletQueryKey);

  if (currentDto && dto.version < currentDto.version) {
    return {
      dto: currentDto,
      isApplied: false,
      wallet: mapAttemptsWalletDtoToAttemptsWallet(currentDto)
    };
  }

  queryClient.setQueryData(attemptsWalletQueryKey, dto);

  return {
    dto,
    isApplied: true,
    wallet: mapAttemptsWalletDtoToAttemptsWallet(dto)
  };
}

export function setAttemptsWalletQueryData(queryClient: QueryClient, dto: AttemptsWalletDto): AttemptsWallet {
  return applyAttemptsWalletQueryData(queryClient, dto).wallet;
}
