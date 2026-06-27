import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { CLIENT_EVENT_TYPES, realtimeClient } from "@/shared/lib/realtime";
import { notify } from "@/shared/lib/toast";

import { type AttemptsWalletDto } from "../api/types";
import { applyAttemptsWalletQueryData } from "./attempts-wallet-query";

function isAttemptsWalletDto(value: unknown): value is AttemptsWalletDto {
  if (!value || typeof value !== "object") {
    return false;
  }

  const dto = value as Partial<AttemptsWalletDto>;

  return (
    typeof dto.isChannelBonusGranted === "boolean" &&
    typeof dto.notExpiredAttempts === "number" &&
    typeof dto.todayAttempts === "number" &&
    typeof dto.version === "number"
  );
}

function getNotificationMessage(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const message = value.trim();

  return message || null;
}

export function useAttemptsWalletRealtimeSync(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    return realtimeClient.subscribe(CLIENT_EVENT_TYPES.walletUpdated, (message) => {
      if (!isAttemptsWalletDto(message.data)) {
        console.error("Invalid attempts wallet realtime message", message);
        return;
      }

      const result = applyAttemptsWalletQueryData(queryClient, message.data);

      if (!result.isApplied) {
        return;
      }

      const notificationMessage = getNotificationMessage(message.message);

      if (notificationMessage) {
        notify.success(notificationMessage);
      }
    });
  }, [queryClient]);
}
