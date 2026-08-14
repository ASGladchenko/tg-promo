export function gameSchedulesQueryKey(month: string) {
  return ["game-schedules", month] as const;
}
