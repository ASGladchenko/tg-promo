import { type Dayjs } from "dayjs";

import { type ScheduledGame } from "@/entities/game-schedule";

export function getScheduledGameForDay(games: readonly ScheduledGame[], day: Dayjs) {
  return games.find((game) => !day.isBefore(game.startDate, "day") && !day.isAfter(game.endDate, "day"));
}
