export const luckyMeadowStateQueryKey = ["lucky-meadow", "state"] as const;

export const luckyMeadowPeriodUsersQueryKey = (startDate: string, search: string) =>
  ["lucky-meadow", "period-users", startDate, search] as const;

export const luckyMeadowSnapshotStatsQueryKey = (startDate: string) =>
  ["lucky-meadow", "snapshot-stats", startDate] as const;

export const luckyMeadowUserSessionsQueryKey = (startDate: string, userId: string) =>
  ["lucky-meadow", "user-sessions", startDate, userId] as const;

export const luckyMeadowUserSessionQueryKey = (startDate: string, userId: string, userSnapshotId: string) =>
  ["lucky-meadow", "user-session", startDate, userId, userSnapshotId] as const;
