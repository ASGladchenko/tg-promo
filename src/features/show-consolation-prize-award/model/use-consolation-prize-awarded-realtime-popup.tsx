import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { applyAwardedUserPrizeQueryData, useConsolationModalStore } from "@/entities/prizes";
import { CLIENT_EVENT_TYPES, realtimeClient } from "@/shared/lib/realtime";

export function useConsolationPrizeAwardedRealtimePopup(): void {
  const queryClient = useQueryClient();
  const openModal = useConsolationModalStore((state) => state.open);

  useEffect(() => {
    const unsubscribe = realtimeClient.subscribe(CLIENT_EVENT_TYPES.consolationPrizeAwarded, (message) => {
      const prize = applyAwardedUserPrizeQueryData(queryClient, message.data);

      if (!prize) {
        console.error("Invalid consolation prize realtime message", message);
        return;
      }

      openModal(prize);
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, openModal]);
}
