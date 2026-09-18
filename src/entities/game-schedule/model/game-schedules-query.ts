export const activeGameScheduleQueryKey = ["game-schedules", "active"] as const;

export function gameSchedulesQueryKey(month: string) {
  return ["game-schedules", month] as const;
}
