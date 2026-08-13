import { type ReactNode } from "react";

import dayjs, { type Dayjs } from "dayjs";
import { generatePath, Navigate } from "react-router";

import { type CrackSafeRule } from "@/entities/crack-safe-rules";
import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";
import { AdminCrackSafeRuleUpdateModal } from "@/features/admin-update-crack-safe-rule";
import { APP_ROUTES } from "@/shared/config";

type CrackSafeScheduleFlowProps = {
  getGameName: (gameId: GameScheduleId) => string;
  onClose: () => void;
  onRulesChange: () => void;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
  rule: CrackSafeRule;
  selectedDay: Dayjs;
  scheduledGames: readonly ScheduledGame[];
  startDate: string;
};

export function CrackSafeScheduleFlow({
  getGameName,
  onClose,
  onRulesChange,
  renderScheduledGameDay,
  rule,
  selectedDay,
  scheduledGames,
  startDate
}: CrackSafeScheduleFlowProps) {
  if (!selectedDay.isAfter(dayjs(), "day")) {
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
      rule={rule}
      scheduledGames={scheduledGames}
    />
  );
}
