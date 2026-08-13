import { type ReactNode } from "react";

import { type Dayjs } from "dayjs";

import { CalendarMonth } from "@/shared/ui/calendar-month";
import { Modal } from "@/shared/ui/modal";

import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";

import { useAdminLuckyMeadowRulePeriodSelection } from "../model/use-admin-lucky-meadow-rule-period-selection";
import { AdminLuckyMeadowRulePeriodConflict } from "./admin-lucky-meadow-rule-period-conflict";

import "./admin-lucky-meadow-rule-period-calendar.scss";

type AdminLuckyMeadowRulePeriodCalendarProps = {
  currentScheduleId: string;
  disabled: boolean;
  getGameName: (gameId: GameScheduleId) => string;
  onPeriodConflictsChange: (hasConflicts: boolean) => void;
  renderScheduledGameDay: (game: ScheduledGame) => ReactNode;
  scheduledGames: readonly ScheduledGame[];
};

export function AdminLuckyMeadowRulePeriodCalendar({
  currentScheduleId,
  disabled,
  getGameName,
  onPeriodConflictsChange,
  renderScheduledGameDay,
  scheduledGames
}: AdminLuckyMeadowRulePeriodCalendarProps) {
  const {
    availablePeriods,
    closeConflict,
    conflicts,
    endDay,
    isConflictOpen,
    month,
    selectAvailablePeriod,
    selectDay,
    selectedPeriod,
    selectionStep,
    setMonth,
    startDay
  } = useAdminLuckyMeadowRulePeriodSelection({
    currentScheduleId,
    onPeriodConflictsChange,
    scheduledGames
  });

  const renderDayContent = (day: Dayjs) => {
    const game = scheduledGames.find(
      (scheduledGame) =>
        !day.isBefore(scheduledGame.startDate, "day") && !day.isAfter(scheduledGame.endDate, "day")
    );

    if (!game) {
      return null;
    }

    return renderScheduledGameDay(game);
  };

  return (
    <section className="admin-lucky-meadow-rule-period-calendar" aria-label="Rule period">
      <CalendarMonth
        month={month}
        onDayClick={disabled ? undefined : selectDay}
        onMonthChange={setMonth}
        renderDayContent={renderDayContent}
        selectedEndDay={endDay}
        selectedStartDay={startDay}
      />

      <p className="admin-lucky-meadow-rule-period-calendar__instruction" aria-live="polite">
        {selectionStep === "start" ? "Choose a new start date" : "Choose an end date"}
      </p>

      {isConflictOpen && selectedPeriod ? (
        <Modal
          ariaLabel="Schedule conflict"
          className="admin-lucky-meadow-rule-period-calendar__conflict-modal"
          hasOverlay
          isOpen
          onClose={closeConflict}
        >
          <AdminLuckyMeadowRulePeriodConflict
            availablePeriods={availablePeriods}
            conflicts={conflicts}
            getGameName={getGameName}
            onClose={closeConflict}
            onPeriodSelect={(period) => selectAvailablePeriod(period.startDate, period.endDate)}
            period={selectedPeriod}
          />
        </Modal>
      ) : null}
    </section>
  );
}
