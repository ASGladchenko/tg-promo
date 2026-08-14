import { GameScheduleId } from "@/entities/game-schedule";

type ScheduleGameMetadata = {
  description: string;
  mark: string;
  tone: "primary" | "warning";
  title: string;
};

export const scheduleGameMetadata = {
  [GameScheduleId.CrackSafe]: {
    description: "Open rule settings for this period.",
    mark: "CS",
    tone: "warning",
    title: "Crack Safe"
  },
  [GameScheduleId.LuckyMeadow]: {
    description: "Open rule settings for this period.",
    mark: "LM",
    tone: "primary",
    title: "Lucky Meadow"
  }
} satisfies Record<GameScheduleId, ScheduleGameMetadata>;

export function getScheduleGameTitle(gameId: GameScheduleId) {
  return scheduleGameMetadata[gameId].title;
}
