import { useState } from "react";

import dayjs, { type Dayjs } from "dayjs";
import { generatePath, useNavigate } from "react-router";

import { type CrackSafeRule } from "@/entities/crack-safe-rules";
import { AdminCrackSafeRuleUpdateModal } from "@/features/admin-update-crack-safe-rule";
import { APP_ROUTES } from "@/shared/config";
import { CalendarMonth } from "@/shared/ui/calendar-month";

import { getGamesScheduledForDay } from "../../lib/get-games-scheduled-for-day";
import { ADMIN_SCHEDULE_GAME_DETAILS, AdminScheduleGameId } from "../../model/admin-schedule-game";
import { useAdminScheduledGames } from "../../model/use-admin-scheduled-games";
import { useSchedulePeriodSelection } from "../../model/use-schedule-period-selection";
import { AdminGameScheduleDayEvents } from "../admin-game-schedule-day-events/admin-game-schedule-day-events";
import { AdminGameScheduleModal } from "../admin-game-schedule-modal/admin-game-schedule-modal";

import "./admin-game-schedule.scss";

export function AdminGameSchedule() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => dayjs());
  const [selectedCrackSafeRule, setSelectedCrackSafeRule] = useState<CrackSafeRule>();
  const scheduledGamesQuery = useAdminScheduledGames();
  const scheduledGames = scheduledGamesQuery.data ?? [];
  const {
    closePeriodModal,
    isPeriodModalOpen,
    selectAvailablePeriod,
    selectDay,
    selectedEndDay,
    selectedPeriod,
    selectedPeriodAvailability,
    selectedStartDay
  } = useSchedulePeriodSelection(scheduledGames);

  const getScheduledGamesForDay = (day: Dayjs) => getGamesScheduledForDay(scheduledGames, day);

  const getDayAriaLabel = (day: Dayjs) => {
    const games = getScheduledGamesForDay(day);
    const gameNames = games.map((game) => ADMIN_SCHEDULE_GAME_DETAILS[game.gameId].name).join(", ");

    if (gameNames === "") {
      return day.format("D MMMM YYYY");
    }

    return `${day.format("D MMMM YYYY")}. Scheduled games: ${gameNames}`;
  };

  const handleDayClick = (day: Dayjs) => {
    const crackSafeRule = getScheduledGamesForDay(day).find(
      (game) => game.gameId === AdminScheduleGameId.CrackSafe
    )?.crackSafeRule;

    if (day.isAfter(dayjs(), "day") && crackSafeRule) {
      setSelectedCrackSafeRule(crackSafeRule);

      return;
    }

    if (crackSafeRule) {
      navigate(
        `${APP_ROUTES.admin}/${generatePath(APP_ROUTES.adminCrackSafeSnapshot, {
          startDate: crackSafeRule.startDate
        })}`
      );

      return;
    }

    if (day.isBefore(dayjs(), "day")) {
      return;
    }

    selectDay(day);
  };

  const closeCrackSafeRuleUpdateModal = () => {
    setSelectedCrackSafeRule(undefined);
  };

  return (
    <section className="admin-game-schedule">
      <CalendarMonth
        getDayAriaLabel={getDayAriaLabel}
        month={month}
        onMonthChange={setMonth}
        onDayClick={handleDayClick}
        selectedEndDay={selectedEndDay}
        selectedStartDay={selectedStartDay}
        renderDayContent={(day) => <AdminGameScheduleDayEvents games={getScheduledGamesForDay(day)} />}
      />

      <AdminGameScheduleModal
        availablePeriods={selectedPeriodAvailability?.availablePeriods}
        conflicts={selectedPeriodAvailability?.conflicts}
        isOpen={isPeriodModalOpen}
        onClose={closePeriodModal}
        onPeriodSelect={selectAvailablePeriod}
        period={selectedPeriod}
      />

      <AdminCrackSafeRuleUpdateModal
        isOpen={selectedCrackSafeRule !== undefined}
        onClose={closeCrackSafeRuleUpdateModal}
        rule={selectedCrackSafeRule}
      />
    </section>
  );
}
