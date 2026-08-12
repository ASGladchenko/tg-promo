import { type Dayjs } from "dayjs";

import { type AdminScheduledGame } from "../model/types";

export function getGamesScheduledForDay(games: readonly AdminScheduledGame[], day: Dayjs) {
  return games.filter(
    (game) => !day.isBefore(game.startDate, "day") && !day.isAfter(game.endDate, "day")
  );
}
