import dayjs from "dayjs";

import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";

export type ScheduledGamePeriod = {
  endDate: string;
  label: string;
  startDate: string;
};

export type ScheduledGameConflict = {
  dateLabel: string;
  gameId: GameScheduleId;
};

export function getScheduledGameConflicts(
  games: readonly ScheduledGame[],
  startDate: string,
  endDate: string
): ScheduledGameConflict[] {
  const conflicts: ScheduledGameConflict[] = [];

  for (let day = dayjs(startDate); !day.isAfter(endDate, "day"); day = day.add(1, "day")) {
    const scheduledGame = games.find(
      (game) => !day.isBefore(game.startDate, "day") && !day.isAfter(game.endDate, "day")
    );

    if (scheduledGame) {
      conflicts.push({
        dateLabel: day.format("D MMMM"),
        gameId: scheduledGame.gameId
      });
    }
  }

  return conflicts;
}

export function getAvailableScheduledGamePeriods(
  games: readonly ScheduledGame[],
  startDate: string,
  endDate: string
): ScheduledGamePeriod[] {
  const periods: ScheduledGamePeriod[] = [];
  let availableStartDay: ReturnType<typeof dayjs> | undefined;

  for (let day = dayjs(startDate); !day.isAfter(endDate, "day"); day = day.add(1, "day")) {
    const isOccupied = games.some(
      (game) => !day.isBefore(game.startDate, "day") && !day.isAfter(game.endDate, "day")
    );

    if (!isOccupied) {
      availableStartDay ??= day;

      continue;
    }

    if (availableStartDay) {
      const availableEndDay = day.subtract(1, "day");

      periods.push({
        endDate: availableEndDay.format("YYYY-MM-DD"),
        label: `${availableStartDay.format("D MMM")} — ${availableEndDay.format("D MMM YYYY")}`,
        startDate: availableStartDay.format("YYYY-MM-DD")
      });
      availableStartDay = undefined;
    }
  }

  if (availableStartDay) {
    const availableEndDay = dayjs(endDate);

    periods.push({
      endDate: availableEndDay.format("YYYY-MM-DD"),
      label: `${availableStartDay.format("D MMM")} — ${availableEndDay.format("D MMM YYYY")}`,
      startDate: availableStartDay.format("YYYY-MM-DD")
    });
  }

  return periods;
}
