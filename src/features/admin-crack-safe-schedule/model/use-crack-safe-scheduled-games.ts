import { useMemo } from "react";

import { useCrackSafeRules } from "@/entities/crack-safe-rules";
import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";

export function useCrackSafeScheduledGames() {
  const crackSafeRulesQuery = useCrackSafeRules();

  const data = useMemo<ScheduledGame[] | undefined>(() => {
    if (crackSafeRulesQuery.data === undefined) {
      return undefined;
    }

    return crackSafeRulesQuery.data.map((rule) => ({
      endDate: rule.endDate,
      gameId: GameScheduleId.CrackSafe,
      id: rule.scheduleId,
      name: "Crack Safe",
      startDate: rule.startDate
    }));
  }, [crackSafeRulesQuery.data]);

  return { ...crackSafeRulesQuery, data };
}
