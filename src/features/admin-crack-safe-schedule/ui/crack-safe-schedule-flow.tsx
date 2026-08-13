import dayjs, { type Dayjs } from "dayjs";
import { generatePath, Navigate } from "react-router";

import { type CrackSafeRule } from "@/entities/crack-safe-rules";
import { type ScheduledGame } from "@/entities/game-schedule";
import { AdminCrackSafeRuleUpdateModal } from "@/features/admin-update-crack-safe-rule";
import { APP_ROUTES } from "@/shared/config";

type CrackSafeScheduleFlowProps = {
  game: ScheduledGame;
  onClose: () => void;
  rule: CrackSafeRule;
  selectedDay: Dayjs;
};

export function CrackSafeScheduleFlow({ game, onClose, rule, selectedDay }: CrackSafeScheduleFlowProps) {
  if (!selectedDay.isAfter(dayjs(), "day")) {
    return (
      <Navigate
        replace
        to={`${APP_ROUTES.admin}/${generatePath(APP_ROUTES.adminCrackSafeSnapshot, {
          startDate: game.startDate
        })}`}
      />
    );
  }

  return <AdminCrackSafeRuleUpdateModal isOpen onClose={onClose} rule={rule} />;
}
