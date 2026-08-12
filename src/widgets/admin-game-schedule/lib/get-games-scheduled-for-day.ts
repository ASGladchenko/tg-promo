import { type Dayjs } from "dayjs";

import { type AdminScheduledGame } from "../model/types";

export function getScheduledGameForDay(games: readonly AdminScheduledGame[], day: Dayjs) {
  return games.find((game) => !day.isBefore(game.startDate, "day") && !day.isAfter(game.endDate, "day"));
}
