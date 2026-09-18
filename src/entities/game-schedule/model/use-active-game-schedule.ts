import { useQuery } from "@tanstack/react-query";

import { getActiveGameSchedule } from "../api/get-active-game-schedule";
import { mapActiveGameScheduleResponseToActiveGameSchedule } from "../lib/map-active-game-schedule-response-to-active-game-schedule";
import { activeGameScheduleQueryKey } from "./game-schedules-query";

export function useActiveGameSchedule() {
  return useQuery({
    queryKey: activeGameScheduleQueryKey,
    queryFn: ({ signal }) => getActiveGameSchedule(signal),
    refetchOnWindowFocus: true,
    select: mapActiveGameScheduleResponseToActiveGameSchedule,
    staleTime: 0
  });
}
