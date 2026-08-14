export enum GameScheduleId {
  CrackSafe = "crack-safe",
  LuckyMeadow = "lucky-meadow"
}

export type ScheduledGame = {
  endDate: string;
  gameId: GameScheduleId;
  startDate: string;
};
