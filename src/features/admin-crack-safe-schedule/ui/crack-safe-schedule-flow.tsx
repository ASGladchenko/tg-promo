import dayjs, { type Dayjs } from "dayjs";
import { generatePath, Navigate } from "react-router";

import { useCrackSafeRules } from "@/entities/crack-safe-rules";
import { type ScheduledGame } from "@/entities/game-schedule";
import { AdminCrackSafeRuleUpdateModal } from "@/features/admin-update-crack-safe-rule";
import { APP_ROUTES } from "@/shared/config";

type CrackSafeScheduleFlowProps = {
  game: ScheduledGame;
  onClose: () => void;
  selectedDay: Dayjs;
};

export function CrackSafeScheduleFlow({ game, onClose, selectedDay }: CrackSafeScheduleFlowProps) {
  const crackSafeRulesQuery = useCrackSafeRules();

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

  const rule = crackSafeRulesQuery.data?.find((item) => item.scheduleId === game.id);

  return <AdminCrackSafeRuleUpdateModal isOpen={rule !== undefined} onClose={onClose} rule={rule} />;
}
