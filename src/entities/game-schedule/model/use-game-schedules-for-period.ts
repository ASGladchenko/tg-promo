import dayjs from "dayjs";
import { useQueries } from "@tanstack/react-query";

import { getGameSchedules } from "../api/get-game-schedules";
import { mapGameSchedulesResponseToScheduledGames } from "../lib/map-game-schedules-response-to-scheduled-games";
import { type ScheduledGame } from "./types";
import { gameSchedulesQueryKey } from "./game-schedules-query";

function getMonths(startDate: string, endDate: string, currentMonth: string): string[] {
  const currentMonthDate = dayjs(currentMonth).startOf("month");
  const startMonth = startDate ? dayjs(startDate).startOf("month") : currentMonthDate;
  const endMonth = endDate ? dayjs(endDate).startOf("month") : currentMonthDate;
  const firstMonth = startMonth.isBefore(endMonth) ? startMonth : endMonth;
  const lastMonth = startMonth.isAfter(endMonth) ? startMonth : endMonth;
  const months: string[] = [];

  for (let month = firstMonth; !month.isAfter(lastMonth, "month"); month = month.add(1, "month")) {
    months.push(month.format("YYYY-MM"));
  }

  return months;
}

function mergeScheduledGames(games: ScheduledGame[][]): ScheduledGame[] {
  const scheduledGames = new Map<string, ScheduledGame>();

  for (const monthGames of games) {
    for (const game of monthGames) {
      scheduledGames.set(`${game.gameId}:${game.startDate}:${game.endDate}`, game);
    }
  }

  return [...scheduledGames.values()];
}

export function useGameSchedulesForPeriod(startDate: string, endDate: string, currentMonth: string) {
  const months = getMonths(startDate, endDate, currentMonth);
  const queries = useQueries({
    queries: months.map((month) => ({
      queryKey: gameSchedulesQueryKey(month),
      queryFn: ({ signal }: { signal: AbortSignal }) => getGameSchedules(month, signal),
      refetchOnWindowFocus: true,
      select: mapGameSchedulesResponseToScheduledGames,
      staleTime: 0
    }))
  });

  return {
    data: mergeScheduledGames(queries.map((query) => query.data ?? [])),
    isLoading: queries.some((query) => query.isLoading)
  };
}
