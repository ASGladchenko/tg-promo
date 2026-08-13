import { useState } from "react";

import dayjs, { type Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";

import { type ScheduledGame } from "@/entities/game-schedule";
import { type AdminLuckyMeadowRuleFormState } from "@/entities/lucky-meadow";

import {
  getAvailableScheduledGamePeriods,
  getScheduledGameConflicts
} from "../lib/get-scheduled-game-conflicts";

type UseAdminLuckyMeadowRulePeriodSelectionParams = {
  currentScheduleId: string;
  onPeriodConflictsChange: (hasConflicts: boolean) => void;
  scheduledGames: readonly ScheduledGame[];
};

function parseDay(value: string) {
  const day = dayjs(value);

  return day.isValid() ? day : undefined;
}

export function useAdminLuckyMeadowRulePeriodSelection({
  currentScheduleId,
  onPeriodConflictsChange,
  scheduledGames
}: UseAdminLuckyMeadowRulePeriodSelectionParams) {
  const { setValue, watch } = useFormContext<AdminLuckyMeadowRuleFormState>();
  const startDay = parseDay(watch("startDate"));
  const endDay = parseDay(watch("endDate"));
  const [month, setMonth] = useState(() => startDay ?? dayjs());
  const [selectionStep, setSelectionStep] = useState<"end" | "start">("start");
  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const otherScheduledGames = scheduledGames.filter((game) => game.id !== currentScheduleId);

  const conflicts =
    startDay && endDay
      ? getScheduledGameConflicts(
          otherScheduledGames,
          startDay.format("YYYY-MM-DD"),
          endDay.format("YYYY-MM-DD")
        )
      : [];

  const availablePeriods =
    startDay && endDay
      ? getAvailableScheduledGamePeriods(
          otherScheduledGames,
          startDay.format("YYYY-MM-DD"),
          endDay.format("YYYY-MM-DD")
        )
      : [];

  const selectedPeriod =
    startDay && endDay
      ? {
          endDate: endDay.format("YYYY-MM-DD"),
          label: `${startDay.format("D MMM YYYY")} ${"\u2014"} ${endDay.format("D MMM YYYY")}`,
          startDate: startDay.format("YYYY-MM-DD")
        }
      : undefined;

  const selectDay = (day: Dayjs) => {
    if (selectionStep === "start" || startDay === undefined) {
      setValue("startDate", day.format("YYYY-MM-DD"), { shouldDirty: true, shouldTouch: true });
      setValue("endDate", "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setMonth(day);
      setSelectionStep("end");
      onPeriodConflictsChange(false);

      return false;
    }

    if (day.isBefore(startDay, "day")) {
      setValue("startDate", day.format("YYYY-MM-DD"), { shouldDirty: true, shouldTouch: true });
      setValue("endDate", "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setMonth(day);
      onPeriodConflictsChange(false);

      return false;
    }

    setValue("endDate", day.format("YYYY-MM-DD"), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
    setSelectionStep("start");

    const hasConflicts =
      getScheduledGameConflicts(otherScheduledGames, startDay.format("YYYY-MM-DD"), day.format("YYYY-MM-DD"))
        .length > 0;

    onPeriodConflictsChange(hasConflicts);
    setIsConflictOpen(hasConflicts);

    return !hasConflicts;
  };

  const selectAvailablePeriod = (startDate: string, endDate: string) => {
    setValue("startDate", startDate, { shouldDirty: true, shouldTouch: true });
    setValue("endDate", endDate, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setMonth(dayjs(startDate));
    setSelectionStep("start");
    setIsConflictOpen(false);
    onPeriodConflictsChange(false);
  };

  const closeConflict = () => {
    setIsConflictOpen(false);
    setSelectionStep("start");
    setValue("startDate", "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setValue("endDate", "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    onPeriodConflictsChange(false);
  };

  return {
    availablePeriods,
    closeConflict,
    conflicts,
    endDay,
    isConflictOpen,
    month,
    selectAvailablePeriod,
    selectDay,
    selectedPeriod,
    selectionStep,
    setMonth,
    startDay
  };
}
