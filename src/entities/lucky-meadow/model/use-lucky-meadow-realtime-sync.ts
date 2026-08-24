import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { CLIENT_EVENT_TYPES, realtimeClient } from "@/shared/lib/realtime";

import { luckyMeadowStateQueryKey } from "./lucky-meadow-query";
import { useLuckyMeadowStore } from "./lucky-meadow-store";

type LuckyMeadowSessionFinishedDto = {
  reason: "game_finished" | "period_finished";
};

function isLuckyMeadowSessionFinishedDto(value: unknown): value is LuckyMeadowSessionFinishedDto {
  if (!value || typeof value !== "object") {
    return false;
  }

  const dto = value as Partial<LuckyMeadowSessionFinishedDto>;

  return dto.reason === "game_finished" || dto.reason === "period_finished";
}

export function useLuckyMeadowRealtimeSync(): void {
  const queryClient = useQueryClient();
  const resetGame = useLuckyMeadowStore((state) => state.resetGame);

  useEffect(() => {
    return realtimeClient.subscribe(CLIENT_EVENT_TYPES.luckyMeadowSessionFinished, (message) => {
      if (!isLuckyMeadowSessionFinishedDto(message.data)) {
        console.error("Invalid Lucky Meadow realtime message", message);
        return;
      }

      resetGame();
      void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });
    });
  }, [queryClient, resetGame]);
}
