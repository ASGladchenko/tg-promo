import { useMemo } from "react";

import { GameScheduleId } from "@/entities/game-schedule";
import { useQuery } from "@tanstack/react-query";

import { getGamesCalendarRulesDto } from "../api/get-games-calendar-rules";
import { type AdminScheduledGame } from "./types";
import { gamesCalendarRulesQueryKey } from "./games-calendar-rules-query";

export function useAdminScheduledGames() {
  const gamesCalendarRulesQuery = useQuery({
    queryKey: gamesCalendarRulesQueryKey,
    queryFn: ({ signal }) => getGamesCalendarRulesDto(signal)
  });

  const data = useMemo<AdminScheduledGame[] | undefined>(() => {
    if (gamesCalendarRulesQuery.data === undefined) {
      return undefined;
    }

    const crackSafeGames = gamesCalendarRulesQuery.data.crackSafe.map(
      (rule): AdminScheduledGame => ({
        endDate: rule.endDate,
        gameId: GameScheduleId.CrackSafe,
        id: rule.scheduleId,
        rule,
        startDate: rule.startDate
      })
    );

    const luckyMeadowGames = gamesCalendarRulesQuery.data.luckyMeadow.map(
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
  }, [gamesCalendarRulesQuery.data]);

  return {
    data,
    error: gamesCalendarRulesQuery.error,
    isError: gamesCalendarRulesQuery.isError,
    isLoading: gamesCalendarRulesQuery.isLoading,
    refetch: gamesCalendarRulesQuery.refetch
  };
}
