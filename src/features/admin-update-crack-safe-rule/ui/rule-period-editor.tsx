import { type ReactNode } from "react";

import { useFormContext } from "react-hook-form";

import { GameScheduleId, SchedulePeriodEditor, type ScheduledGame } from "@/entities/game-schedule";
import { type AdminCrackSafeRuleFormState } from "@/entities/crack-safe-rules";

type RulePeriodEditorProps = {
  currentScheduleId: string;
  disabled: boolean;
  getGameName: (gameId: GameScheduleId) => string;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
  scheduledGames: readonly ScheduledGame[];
};

export function RulePeriodEditor({
  currentScheduleId,
  disabled,
  getGameName,
  renderScheduledGameDay,
  scheduledGames
}: RulePeriodEditorProps) {
  const { setValue, watch } = useFormContext<AdminCrackSafeRuleFormState>();

  return (
    <SchedulePeriodEditor
      currentScheduleId={currentScheduleId}
      disabled={disabled}
      endDate={watch("endDate")}
      getGameName={getGameName}
      onChange={(startDate, endDate) => {
        setValue("startDate", startDate, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
        setValue("endDate", endDate, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      }}
      renderScheduledGameDay={renderScheduledGameDay}
      scheduledGames={scheduledGames}
      startDate={watch("startDate")}
    />
  );
}
