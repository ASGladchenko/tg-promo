import { type QueryClient } from "@tanstack/react-query";

import { type AttemptsWalletDto } from "../api/types";
import { mapAttemptsWalletDtoToAttemptsWallet } from "../lib/map-attempts-wallet-dto-to-attempts-wallet";
import { type AttemptsWallet } from "./types";

export const attemptsWalletQueryKey = ["attempts", "wallet"] as const;

export function setAttemptsWalletQueryData(queryClient: QueryClient, dto: AttemptsWalletDto): AttemptsWallet {
  queryClient.setQueryData(attemptsWalletQueryKey, dto);

  return mapAttemptsWalletDtoToAttemptsWallet(dto);
}
