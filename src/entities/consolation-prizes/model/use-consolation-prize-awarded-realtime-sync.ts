import { useEffect } from "react";

import { CLIENT_EVENT_TYPES, realtimeClient } from "@/shared/lib/realtime";
import { notify } from "@/shared/lib/toast";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNotificationMessage(value: unknown): string {
  if (typeof value !== "string") {
    return "You received a consolation prize.";
  }

  const message = value.trim();

  return message || "You received a consolation prize.";
}

function isConsolationPrizeAwardedData(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.prizeId === "string" &&
    value.sourceType === "consolation-prize" &&
    isRecord(value.prizeData)
  );
}

export function useConsolationPrizeAwardedRealtimeSync(): void {
  useEffect(() => {
    return realtimeClient.subscribe(CLIENT_EVENT_TYPES.consolationPrizeAwarded, (message) => {
      if (!isConsolationPrizeAwardedData(message.data)) {
        console.error("Invalid consolation prize realtime message", message);
        return;
      }

      notify.success(getNotificationMessage(message.message));
    });
  }, []);
}
