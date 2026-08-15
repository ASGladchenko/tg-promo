import { useEffect, useState } from "react";

import dayjs, { type Dayjs } from "dayjs";

import { useGameSchedulesForPeriod } from "@/entities/game-schedule";

import { getSchedulePeriodAvailability } from "../lib/get-schedule-period-availability";
import { type AdminSchedulePeriod } from "./types";

export function useSchedulePeriodSelection(month: Dayjs) {
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [selectedEndDay, setSelectedEndDay] = useState<Dayjs>();
  const [selectedStartDay, setSelectedStartDay] = useState<Dayjs>();
  const scheduledGamesQuery = useGameSchedulesForPeriod(
    selectedStartDay?.format("YYYY-MM-DD") ?? "",
    selectedEndDay?.format("YYYY-MM-DD") ?? "",
    month.format("YYYY-MM")
  );
  const scheduledGames = scheduledGamesQuery.data;

  useEffect(() => {
    if (selectedStartDay && selectedEndDay && !scheduledGamesQuery.isLoading) {
      setIsPeriodModalOpen(true);
    }
  }, [scheduledGamesQuery.isLoading, selectedEndDay, selectedStartDay]);

  const selectedPeriodAvailability =
    selectedStartDay && selectedEndDay && !scheduledGamesQuery.isLoading
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
