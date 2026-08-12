import { useMemo } from "react";

import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";
import { useLuckyMeadowRules } from "@/entities/lucky-meadow";

export function useLuckyMeadowScheduledGames() {
  const luckyMeadowRulesQuery = useLuckyMeadowRules();

  const data = useMemo<ScheduledGame[] | undefined>(() => {
    if (luckyMeadowRulesQuery.data === undefined) {
      return undefined;
    }

    return luckyMeadowRulesQuery.data.map((rule) => ({
      endDate: rule.endDate,
      gameId: GameScheduleId.LuckyMeadow,
      id: rule.scheduleId,
      name: "Lucky Meadow",
      startDate: rule.startDate
    }));
  }, [luckyMeadowRulesQuery.data]);

  return { ...luckyMeadowRulesQuery, data };
}
