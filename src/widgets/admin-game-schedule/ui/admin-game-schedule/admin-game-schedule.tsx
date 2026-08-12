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
import { AdminGameScheduleDayEvents } from "../admin-game-schedule-day-events/admin-game-schedule-day-events";
import { AdminGameScheduleModal } from "../admin-game-schedule-modal/admin-game-schedule-modal";

import "./admin-game-schedule.scss";

export function AdminGameSchedule() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => dayjs());
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [selectedCrackSafeRule, setSelectedCrackSafeRule] = useState<CrackSafeRule>();
  const [selectedEndDay, setSelectedEndDay] = useState<Dayjs>();
  const [selectedStartDay, setSelectedStartDay] = useState<Dayjs>();
  const scheduledGamesQuery = useAdminScheduledGames();
  const scheduledGames = scheduledGamesQuery.data ?? [];

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

    if (
      selectedStartDay === undefined ||
      selectedEndDay !== undefined ||
      day.isBefore(selectedStartDay, "day")
    ) {
      setSelectedStartDay(day);
      setSelectedEndDay(undefined);

      return;
    }

    setSelectedEndDay(day);
    setIsPeriodModalOpen(true);
  };

  const closePeriodModal = () => {
    setIsPeriodModalOpen(false);
    setSelectedStartDay(undefined);
    setSelectedEndDay(undefined);
  };

  const closeCrackSafeRuleUpdateModal = () => {
    setSelectedCrackSafeRule(undefined);
  };

  const selectedPeriodLabel =
    selectedStartDay && selectedEndDay
      ? `${selectedStartDay.format("D MMM YYYY")} — ${selectedEndDay.format("D MMM YYYY")}`
      : undefined;

  const selectedPeriod =
    selectedStartDay && selectedEndDay && selectedPeriodLabel
      ? {
          endDate: selectedEndDay.format("YYYY-MM-DD"),
          label: selectedPeriodLabel,
          startDate: selectedStartDay.format("YYYY-MM-DD")
        }
      : undefined;

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

      <AdminGameScheduleModal period={selectedPeriod} isOpen={isPeriodModalOpen} onClose={closePeriodModal} />

      <AdminCrackSafeRuleUpdateModal
        isOpen={selectedCrackSafeRule !== undefined}
        onClose={closeCrackSafeRuleUpdateModal}
        rule={selectedCrackSafeRule}
      />
    </section>
  );
}
