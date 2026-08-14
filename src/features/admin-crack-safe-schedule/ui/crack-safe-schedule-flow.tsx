import { type ReactNode } from "react";

import dayjs, { type Dayjs } from "dayjs";
import { generatePath, Navigate } from "react-router";

import { useCrackSafeRule } from "@/entities/crack-safe-rules";
import { GameScheduleId } from "@/entities/game-schedule";
import { AdminCrackSafeRuleUpdateModal } from "@/features/admin-update-crack-safe-rule";
import { APP_ROUTES } from "@/shared/config";

type CrackSafeScheduleFlowProps = {
  getGameName: (gameId: GameScheduleId) => string;
  onClose: () => void;
  onRulesChange: () => void;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
  selectedDay: Dayjs;
  startDate: string;
};

export function CrackSafeScheduleFlow({
  getGameName,
  onClose,
  onRulesChange,
  renderScheduledGameDay,
  selectedDay,
  startDate
}: CrackSafeScheduleFlowProps) {
  const isEditable = selectedDay.isAfter(dayjs(), "day");
  const crackSafeRuleQuery = useCrackSafeRule(startDate, isEditable);

  if (!isEditable) {
    return (
      <Navigate
        replace
        to={`${APP_ROUTES.admin}/${generatePath(APP_ROUTES.adminCrackSafeSnapshot, {
          startDate
        })}`}
      />
    );
  }

  return (
    <AdminCrackSafeRuleUpdateModal
      getGameName={getGameName}
      isOpen
      onClose={onClose}
      onSuccess={onRulesChange}
      renderScheduledGameDay={renderScheduledGameDay}
      rule={crackSafeRuleQuery.data}
    />
  );
}
