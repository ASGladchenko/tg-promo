import { type Dayjs } from "dayjs";

import {
  type AdminSchedulePeriod,
  type AdminSchedulePeriodAvailability,
  type AdminScheduledGame
} from "../model/types";
import { getScheduledGameForDay } from "./get-games-scheduled-for-day";

function createPeriod(startDay: Dayjs, endDay: Dayjs): AdminSchedulePeriod {
  const startDate = startDay.format("YYYY-MM-DD");
  const endDate = endDay.format("YYYY-MM-DD");

  return {
    endDate,
    label: startDay.isSame(endDay, "day")
      ? startDay.format("D MMM YYYY")
      : `${startDay.format("D MMM YYYY")} — ${endDay.format("D MMM YYYY")}`,
    startDate
  };
}

export function getSchedulePeriodAvailability(
  games: readonly AdminScheduledGame[],
  startDay: Dayjs,
  endDay: Dayjs
): AdminSchedulePeriodAvailability {
  const availablePeriods: AdminSchedulePeriod[] = [];
  const conflicts = [];
  let availablePeriodStartDay: Dayjs | undefined;

  for (let day = startDay; !day.isAfter(endDay, "day"); day = day.add(1, "day")) {
    const scheduledGame = getScheduledGameForDay(games, day);

    if (scheduledGame === undefined) {
      availablePeriodStartDay ??= day;

      continue;
    }

    if (availablePeriodStartDay) {
      availablePeriods.push(createPeriod(availablePeriodStartDay, day.subtract(1, "day")));
      availablePeriodStartDay = undefined;
    }

    conflicts.push({
      dateLabel: day.format("D MMMM"),
      gameName: scheduledGame.name
    });
  }

  if (availablePeriodStartDay) {
    availablePeriods.push(createPeriod(availablePeriodStartDay, endDay));
  }

  return { availablePeriods, conflicts };
}
