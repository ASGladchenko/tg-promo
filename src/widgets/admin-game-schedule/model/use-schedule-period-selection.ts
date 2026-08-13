import { useState } from "react";

import dayjs, { type Dayjs } from "dayjs";

import { getSchedulePeriodAvailability } from "../lib/get-schedule-period-availability";
import { type AdminScheduledGame, type AdminSchedulePeriod } from "./types";

export function useSchedulePeriodSelection(scheduledGames: readonly AdminScheduledGame[]) {
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [selectedEndDay, setSelectedEndDay] = useState<Dayjs>();
  const [selectedStartDay, setSelectedStartDay] = useState<Dayjs>();

  const selectedPeriodAvailability =
    selectedStartDay && selectedEndDay
      ? getSchedulePeriodAvailability(scheduledGames, selectedStartDay, selectedEndDay)
      : undefined;

  const selectedPeriodLabel =
    selectedStartDay && selectedEndDay
      ? `${selectedStartDay.format("D MMM YYYY")} — ${selectedEndDay.format("D MMM YYYY")}`
      : undefined;

  const selectedPeriod =
    selectedStartDay && selectedEndDay && selectedPeriodLabel
      ? {
          endDate: selectedEndDay.format("YYYY-MM-DD"),
          label: selectedPeriodLabel,
          startDate: selectedStartDay.format("YYYY-MM-DD")
        }
      : undefined;

  const selectDay = (day: Dayjs) => {
    if (
      selectedStartDay === undefined ||
      selectedEndDay !== undefined ||
      day.isBefore(selectedStartDay, "day")
    ) {
      setSelectedStartDay(day);
      setSelectedEndDay(undefined);

      return;
    }

    setSelectedEndDay(day);
    setIsPeriodModalOpen(true);
  };

  const closePeriodModal = () => {
    setIsPeriodModalOpen(false);
    setSelectedStartDay(undefined);
    setSelectedEndDay(undefined);
  };

  const selectAvailablePeriod = (period: AdminSchedulePeriod) => {
    setSelectedStartDay(dayjs(period.startDate));
    setSelectedEndDay(dayjs(period.endDate));
  };

  return {
    closePeriodModal,
    isPeriodModalOpen,
    selectAvailablePeriod,
    selectDay,
    selectedEndDay,
    selectedPeriod,
    selectedPeriodAvailability,
    selectedStartDay
  };
}
