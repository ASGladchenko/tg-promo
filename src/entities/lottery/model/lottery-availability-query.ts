import { type QueryClient } from "@tanstack/react-query";

import { type LotteryAvailabilityResponseDto } from "../api/types";

export const lotteryAvailabilityQueryKey = ["lottery", "availability"] as const;

export function addLotteryEnteredCodeToQueryData(queryClient: QueryClient, enteredCode: string): void {
  queryClient.setQueryData<LotteryAvailabilityResponseDto>(lotteryAvailabilityQueryKey, (currentDto) => {
    if (!currentDto || currentDto.enteredCodes.includes(enteredCode)) {
      return currentDto;
    }

    return {
      ...currentDto,
      enteredCodes: [...currentDto.enteredCodes, enteredCode]
    };
  });
}
