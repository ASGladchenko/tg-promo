import { useMemo } from "react";

import { useCrackSafeRules } from "@/entities/crack-safe-rules";
import { GameScheduleId } from "@/entities/game-schedule";
import { useLuckyMeadowRules } from "@/entities/lucky-meadow";

import { type AdminScheduledGame } from "./types";

export function useAdminScheduledGames() {
  const crackSafeRulesQuery = useCrackSafeRules();
  const luckyMeadowRulesQuery = useLuckyMeadowRules();

  const data = useMemo<AdminScheduledGame[] | undefined>(() => {
    if (crackSafeRulesQuery.data === undefined || luckyMeadowRulesQuery.data === undefined) {
      return undefined;
    }

    const crackSafeGames = crackSafeRulesQuery.data.map(
      (rule): AdminScheduledGame => ({
        endDate: rule.endDate,
        gameId: GameScheduleId.CrackSafe,
        id: rule.scheduleId,
        rule,
        startDate: rule.startDate
      })
    );

    const luckyMeadowGames = luckyMeadowRulesQuery.data.map(
      (rule): AdminScheduledGame => ({
        endDate: rule.endDate,
        gameId: GameScheduleId.LuckyMeadow,
        id: rule.scheduleId,
        rule,
        startDate: rule.startDate
      })
    );
    const games = [...crackSafeGames, ...luckyMeadowGames];

    return games.sort((left, right) => left.startDate.localeCompare(right.startDate));
  }, [crackSafeRulesQuery.data, luckyMeadowRulesQuery.data]);

  return {
    data,
    error: crackSafeRulesQuery.error ?? luckyMeadowRulesQuery.error,
    isError: crackSafeRulesQuery.isError || luckyMeadowRulesQuery.isError,
    isLoading: crackSafeRulesQuery.isLoading || luckyMeadowRulesQuery.isLoading
  };
}
