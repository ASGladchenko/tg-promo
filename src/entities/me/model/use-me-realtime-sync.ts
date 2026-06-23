import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { realtimeClient } from "@/shared/lib/realtime";
import { notify } from "@/shared/lib/toast";

import { patchMeQueryData } from "./me-query";

type TelegramPhoneUpdatedPayload = {
  phone: string;
};

const telegramPhoneUpdatedEventType = "telegram.phone.updated";

const telegramPhoneUpdatedFallbackMessage = "Phone number updated";

function isTelegramPhoneUpdatedPayload(value: unknown): value is TelegramPhoneUpdatedPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<TelegramPhoneUpdatedPayload>;

  return typeof payload.phone === "string";
}

export function useMeRealtimeSync(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    return realtimeClient.subscribe(telegramPhoneUpdatedEventType, (message) => {
      if (!isTelegramPhoneUpdatedPayload(message.data)) {
        console.error("Invalid telegram phone realtime message", message);
        return;
      }

      const me = patchMeQueryData(queryClient, { phone: message.data.phone });

      if (!me) {
        console.log("Skipped telegram phone realtime message because me cache is empty", message);
        return;
      }

      notify.success(message.message ?? telegramPhoneUpdatedFallbackMessage);
    });
  }, [queryClient]);
}
