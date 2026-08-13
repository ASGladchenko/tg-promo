import { type ReactNode } from "react";

import dayjs, { type Dayjs } from "dayjs";
import { generatePath, Navigate } from "react-router";

import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";
import { type LuckyMeadowRule } from "@/entities/lucky-meadow";
import { AdminLuckyMeadowRuleUpdateModal } from "@/features/admin-update-lucky-meadow-rule";
import { APP_ROUTES } from "@/shared/config";

type LuckyMeadowScheduleFlowProps = {
  getGameName: (gameId: GameScheduleId) => string;
  onClose: () => void;
  onRulesChange: () => void;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
  rule: LuckyMeadowRule;
  selectedDay: Dayjs;
  scheduledGames: readonly ScheduledGame[];
  startDate: string;
};

export function LuckyMeadowScheduleFlow({
  getGameName,
  onClose,
  onRulesChange,
  renderScheduledGameDay,
  rule,
  selectedDay,
  scheduledGames,
  startDate
}: LuckyMeadowScheduleFlowProps) {
  if (!selectedDay.isAfter(dayjs(), "day")) {
    return (
      <Navigate
        replace
        to={`${APP_ROUTES.admin}/${generatePath(APP_ROUTES.adminLuckyMeadowSnapshot, {
          startDate
        })}`}
      />
    );
  }

  return (
    <AdminLuckyMeadowRuleUpdateModal
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
