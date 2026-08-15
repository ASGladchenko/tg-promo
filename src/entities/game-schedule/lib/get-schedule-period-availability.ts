import dayjs from "dayjs";

import { GameScheduleId, type ScheduledGame } from "../model/types";

export type SchedulePeriod = {
  endDate: string;
  label: string;
  startDate: string;
};

export type SchedulePeriodConflict = {
  dateLabel: string;
  gameId: GameScheduleId;
};

export function getSchedulePeriodAvailability(
  games: readonly ScheduledGame[],
  startDate: string,
  endDate: string
) {
  const availablePeriods: SchedulePeriod[] = [];
  const conflicts: SchedulePeriodConflict[] = [];
  let availableStartDay: ReturnType<typeof dayjs> | undefined;

  for (let day = dayjs(startDate); !day.isAfter(endDate, "day"); day = day.add(1, "day")) {
    const scheduledGame = games.find(
      (game) => !day.isBefore(game.startDate, "day") && !day.isAfter(game.endDate, "day")
    );

    if (!scheduledGame) {
      availableStartDay ??= day;

      continue;
    }

    if (availableStartDay) {
      const availableEndDay = day.subtract(1, "day");

      availablePeriods.push({
        endDate: availableEndDay.format("YYYY-MM-DD"),
        label: `${availableStartDay.format("D MMM")} — ${availableEndDay.format("D MMM YYYY")}`,
        startDate: availableStartDay.format("YYYY-MM-DD")
      });
      availableStartDay = undefined;
    }

    conflicts.push({
      dateLabel: day.format("D MMMM"),
      gameId: scheduledGame.gameId
    });
  }

  if (availableStartDay) {
    availablePeriods.push({
      endDate,
      label: `${availableStartDay.format("D MMM")} — ${dayjs(endDate).format("D MMM YYYY")}`,
      startDate: availableStartDay.format("YYYY-MM-DD")
    });
  }

  return { availablePeriods, conflicts };
}
