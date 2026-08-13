import { useState } from "react";

import dayjs, { type Dayjs } from "dayjs";

import { CalendarMonth } from "@/shared/ui/calendar-month";

import { getScheduledGameForDay as findScheduledGameForDay } from "../../lib/get-games-scheduled-for-day";
import { type AdminScheduledGame } from "../../model/types";
import { useAdminScheduledGames } from "../../model/use-admin-scheduled-games";
import { useSchedulePeriodSelection } from "../../model/use-schedule-period-selection";
import { AdminGameScheduleGameDay } from "../admin-game-schedule-game-day/admin-game-schedule-game-day";
import { AdminGameScheduleGameFlow } from "../admin-game-schedule-game-flow/admin-game-schedule-game-flow";
import { AdminGameScheduleModal } from "../admin-game-schedule-modal/admin-game-schedule-modal";

import "./admin-game-schedule.scss";

export function AdminGameSchedule() {
  const [month, setMonth] = useState(() => dayjs());
  const [selectedScheduledGame, setSelectedScheduledGame] = useState<{
    day: Dayjs;
    game: AdminScheduledGame;
  }>();
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

  const getScheduledGameForDay = (day: Dayjs) => findScheduledGameForDay(scheduledGames, day);

  const getDayAriaLabel = (day: Dayjs) => {
    const game = getScheduledGameForDay(day);

    if (game === undefined) {
      return day.format("D MMMM YYYY");
    }

    return `${day.format("D MMMM YYYY")}. Scheduled game: ${game.name}`;
  };

  const handleDayClick = (day: Dayjs) => {
    const game = getScheduledGameForDay(day);

    if (game) {
      setSelectedScheduledGame({ day, game });

      return;
    }

    if (day.isBefore(dayjs(), "day")) {
      return;
    }

    selectDay(day);
  };

  const closeScheduledGame = () => {
    setSelectedScheduledGame(undefined);
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
        renderDayContent={(day) => {
          const game = getScheduledGameForDay(day);

          return game ? <AdminGameScheduleGameDay gameId={game.gameId} /> : null;
        }}
      />

      <AdminGameScheduleModal
        availablePeriods={selectedPeriodAvailability?.availablePeriods}
        conflicts={selectedPeriodAvailability?.conflicts}
        isOpen={isPeriodModalOpen}
        onClose={closePeriodModal}
        onPeriodSelect={selectAvailablePeriod}
        period={selectedPeriod}
      />

      {selectedScheduledGame ? (
        <AdminGameScheduleGameFlow
          game={selectedScheduledGame.game}
          onClose={closeScheduledGame}
          selectedDay={selectedScheduledGame.day}
        />
      ) : null}
    </section>
  );
}
