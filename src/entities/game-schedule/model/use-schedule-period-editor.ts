import { useState } from "react";

import dayjs, { type Dayjs } from "dayjs";

import { getSchedulePeriodAvailability, type SchedulePeriod } from "../lib/get-schedule-period-availability";
import { useGameSchedulesForPeriod } from "./use-game-schedules-for-period";

type UseSchedulePeriodEditorParams = {
  currentStartDate: string;
  disabled: boolean;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  startDate: string;
};

function formatPeriod(startDate: string, endDate: string) {
  return `${dayjs(startDate).format("D MMM YYYY")} — ${
    endDate ? dayjs(endDate).format("D MMM YYYY") : "Choose end date"
  }`;
}

export function useSchedulePeriodEditor({
  currentStartDate,
  disabled,
  endDate,
  onChange,
  startDate
}: UseSchedulePeriodEditorParams) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const [month, setMonth] = useState(() => dayjs(startDate));
  const [initialPeriod] = useState(() => ({ endDate, startDate }));

  const scheduledGamesQuery = useGameSchedulesForPeriod(startDate, endDate, month.format("YYYY-MM"));
  const scheduledGames = scheduledGamesQuery.data;
  const otherScheduledGames = scheduledGames.filter((game) => game.startDate !== currentStartDate);
  const startDay = startDate ? dayjs(startDate) : undefined;
  const endDay = endDate ? dayjs(endDate) : undefined;
  const isSelectingStart = endDay !== undefined;

  const selectedPeriod: SchedulePeriod | undefined =
    startDate && endDate ? { endDate, label: formatPeriod(startDate, endDate), startDate } : undefined;

  const availability = selectedPeriod
    ? getSchedulePeriodAvailability(otherScheduledGames, startDate, endDate)
    : undefined;

  const closeConflict = () => {
    setIsConflictOpen(false);
    onChange(initialPeriod.startDate, initialPeriod.endDate);
  };

  const selectPeriod = (nextStartDate: string, nextEndDate: string) => {
    onChange(nextStartDate, nextEndDate);
    setIsConflictOpen(false);
    setIsEditorOpen(false);
  };

  const selectDay = (day: Dayjs) => {
    const nextStartDate = day.format("YYYY-MM-DD");

    if (isSelectingStart || startDay === undefined || day.isBefore(startDay, "day")) {
      onChange(nextStartDate, "");
      setMonth(day);

      return;
    }

    const nextEndDate = day.format("YYYY-MM-DD");
    const nextAvailability = getSchedulePeriodAvailability(otherScheduledGames, startDate, nextEndDate);

    onChange(startDate, nextEndDate);

    if (nextAvailability.conflicts.length) {
      setIsConflictOpen(true);

      return;
    }

    setIsEditorOpen(false);
  };

  const getScheduledGameForDay = (day: Dayjs) =>
    scheduledGames.find((game) => !day.isBefore(game.startDate, "day") && !day.isAfter(game.endDate, "day"));

  return {
    availability,
    closeConflict,
    getScheduledGameForDay,
    isCalendarDisabled: disabled || scheduledGamesQuery.isLoading,
    isConflictOpen,
    isEditorOpen,
    isSelectingStart,
    month,
    periodLabel: formatPeriod(startDate, endDate),
    selectDay,
    selectPeriod,
    selectedPeriod,
    setMonth,
    setIsEditorOpen,
    endDay,
    startDay
  };
}
