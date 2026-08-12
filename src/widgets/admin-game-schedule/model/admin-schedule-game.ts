export enum AdminScheduleGameId {
  CrackSafe = "crack-safe",
  LuckyMeadow = "lucky-meadow"
}

export const ADMIN_SCHEDULE_GAME_DETAILS = {
  [AdminScheduleGameId.CrackSafe]: {
    mark: "CS",
    name: "Crack Safe"
  },
  [AdminScheduleGameId.LuckyMeadow]: {
    mark: "LM",
    name: "Lucky Meadow"
  }
} as const;
