import { useMemo } from "react";

import { useCrackSafeScheduledGames } from "@/features/admin-crack-safe-schedule";
import { useLuckyMeadowScheduledGames } from "@/features/admin-lucky-meadow-schedule";

import { type AdminScheduledGame } from "./types";

export function useAdminScheduledGames() {
  const crackSafeGamesQuery = useCrackSafeScheduledGames();
  const luckyMeadowGamesQuery = useLuckyMeadowScheduledGames();

  const data = useMemo<AdminScheduledGame[] | undefined>(() => {
    if (crackSafeGamesQuery.data === undefined || luckyMeadowGamesQuery.data === undefined) {
      return undefined;
    }

    const games: AdminScheduledGame[] = [...crackSafeGamesQuery.data, ...luckyMeadowGamesQuery.data];

    return games.sort((left, right) => left.startDate.localeCompare(right.startDate));
  }, [crackSafeGamesQuery.data, luckyMeadowGamesQuery.data]);

  return {
    data,
    error: crackSafeGamesQuery.error ?? luckyMeadowGamesQuery.error,
    isError: crackSafeGamesQuery.isError || luckyMeadowGamesQuery.isError,
    isLoading: crackSafeGamesQuery.isLoading || luckyMeadowGamesQuery.isLoading
  };
}
