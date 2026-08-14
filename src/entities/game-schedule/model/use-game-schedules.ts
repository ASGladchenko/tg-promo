import { useQuery } from "@tanstack/react-query";

import { getGameSchedules } from "../api/get-game-schedules";
import { mapGameSchedulesResponseToScheduledGames } from "../lib/map-game-schedules-response-to-scheduled-games";
import { gameSchedulesQueryKey } from "./game-schedules-query";

export function useGameSchedules(month: string) {
  return useQuery({
    queryKey: gameSchedulesQueryKey(month),
    queryFn: ({ signal }) => getGameSchedules(month, signal),
    refetchOnWindowFocus: true,
    select: mapGameSchedulesResponseToScheduledGames,
    staleTime: 0
  });
}
