import { type ReactNode } from "react";

import dayjs, { type Dayjs } from "dayjs";
import { generatePath, Navigate } from "react-router";

import { GameScheduleId } from "@/entities/game-schedule";
import { useLuckyMeadowRule } from "@/entities/lucky-meadow";
import { AdminLuckyMeadowRuleUpdateModal } from "@/features/admin-update-lucky-meadow-rule";
import { APP_ROUTES } from "@/shared/config";

type LuckyMeadowScheduleFlowProps = {
  getGameName: (gameId: GameScheduleId) => string;
  onClose: () => void;
  onRulesChange: () => void;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
  selectedDay: Dayjs;
  startDate: string;
};

export function LuckyMeadowScheduleFlow({
  getGameName,
  onClose,
  onRulesChange,
  renderScheduledGameDay,
  selectedDay,
  startDate
}: LuckyMeadowScheduleFlowProps) {
  const isEditable = selectedDay.isAfter(dayjs(), "day");
  const luckyMeadowRuleQuery = useLuckyMeadowRule(startDate, isEditable);

  if (!isEditable) {
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
      rule={luckyMeadowRuleQuery.data}
    />
  );
}
