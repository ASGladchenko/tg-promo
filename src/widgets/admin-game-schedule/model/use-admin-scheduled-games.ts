import { useMemo } from "react";

import { useCrackSafeRules } from "@/entities/crack-safe-rules";
import { useLuckyMeadowRules } from "@/entities/lucky-meadow";

import { AdminScheduleGameId } from "./admin-schedule-game";
import { type AdminScheduledGame } from "./types";

export function useAdminScheduledGames() {
  const crackSafeRulesQuery = useCrackSafeRules();
  const luckyMeadowRulesQuery = useLuckyMeadowRules();

  const data = useMemo<AdminScheduledGame[] | undefined>(() => {
    if (crackSafeRulesQuery.data === undefined || luckyMeadowRulesQuery.data === undefined) {
      return undefined;
    }

    const crackSafeGames = crackSafeRulesQuery.data.map((rule) => ({
      endDate: rule.endDate,
      gameId: AdminScheduleGameId.CrackSafe,
      id: rule.scheduleId,
      startDate: rule.startDate
    }));

    const luckyMeadowGames = luckyMeadowRulesQuery.data.map((game) => ({
      endDate: game.endDate,
      gameId: AdminScheduleGameId.LuckyMeadow,
      id: game.scheduleId,
      startDate: game.startDate
    }));

    const games: AdminScheduledGame[] = [...crackSafeGames, ...luckyMeadowGames];

    return games.sort((left, right) => left.startDate.localeCompare(right.startDate));
  }, [crackSafeRulesQuery.data, luckyMeadowRulesQuery.data]);

  return {
    data,
    error: crackSafeRulesQuery.error ?? luckyMeadowRulesQuery.error,
    isError: crackSafeRulesQuery.isError || luckyMeadowRulesQuery.isError,
    isLoading: crackSafeRulesQuery.isLoading || luckyMeadowRulesQuery.isLoading
  };
}
