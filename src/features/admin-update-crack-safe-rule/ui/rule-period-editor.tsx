import { type ReactNode } from "react";

import { useFormContext } from "react-hook-form";

import { GameScheduleId, SchedulePeriodEditor } from "@/entities/game-schedule";
import { type AdminCrackSafeRuleFormState } from "@/entities/crack-safe-rules";

type RulePeriodEditorProps = {
  currentStartDate: string;
  disabled: boolean;
  getGameName: (gameId: GameScheduleId) => string;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
};

export function RulePeriodEditor({
  currentStartDate,
  disabled,
  getGameName,
  renderScheduledGameDay
}: RulePeriodEditorProps) {
  const { setValue, watch } = useFormContext<AdminCrackSafeRuleFormState>();

  return (
    <SchedulePeriodEditor
      currentStartDate={currentStartDate}
      disabled={disabled}
      endDate={watch("endDate")}
      getGameName={getGameName}
      onChange={(startDate, endDate) => {
        setValue("startDate", startDate, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
        setValue("endDate", endDate, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      }}
      renderScheduledGameDay={renderScheduledGameDay}
      startDate={watch("startDate")}
    />
  );
}
