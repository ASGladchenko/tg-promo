export enum GameScheduleId {
  CrackSafe = "crack-safe",
  LuckyMeadow = "lucky-meadow"
}

export type ActiveGameSchedule = {
  endDate: string | null;
  gameId: GameScheduleId | null;
  scheduleId: string | null;
  startDate: string | null;
};

export type ScheduledGame = {
  endDate: string;
  gameId: GameScheduleId;
  startDate: string;
};
