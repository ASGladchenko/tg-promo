import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { realtimeClient } from "@/shared/lib/realtime";

import { type AttemptsWalletDto } from "../api/types";
import { applyAttemptsWalletQueryData } from "./attempts-wallet-query";

const attemptsWalletUpdatedEventType = "wallet.updated";

function isAttemptsWalletDto(value: unknown): value is AttemptsWalletDto {
  if (!value || typeof value !== "object") {
    return false;
  }

  const dto = value as Partial<AttemptsWalletDto>;

  return (
    typeof dto.notExpiredAttempts === "number" &&
    typeof dto.todayAttempts === "number" &&
    typeof dto.version === "number"
  );
}

export function useAttemptsWalletRealtimeSync(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    return realtimeClient.subscribe(attemptsWalletUpdatedEventType, (message) => {
      if (!isAttemptsWalletDto(message.data)) {
        console.error("Invalid attempts wallet realtime message", message);
        return;
      }

      const result = applyAttemptsWalletQueryData(queryClient, message.data);

      if (!result.isApplied) {
        return;
      }
    });
  }, [queryClient]);
}
