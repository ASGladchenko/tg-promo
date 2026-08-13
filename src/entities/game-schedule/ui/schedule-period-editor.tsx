import { type ReactNode, useState } from "react";

import dayjs, { type Dayjs } from "dayjs";

import { ButtonBase } from "@/shared/ui/button-base";
import { CalendarMonth } from "@/shared/ui/calendar-month";
import { Modal } from "@/shared/ui/modal";

import { GameScheduleId, type ScheduledGame } from "../model/types";
import { getSchedulePeriodAvailability, type SchedulePeriod } from "../lib/get-schedule-period-availability";
import { SchedulePeriodConflict } from "./schedule-period-conflict";

import "./schedule-period-editor.scss";

type SchedulePeriodEditorProps = {
  currentScheduleId: string;
  disabled: boolean;
  endDate: string;
  getGameName: (gameId: GameScheduleId) => string;
  onChange: (startDate: string, endDate: string) => void;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
  scheduledGames: readonly ScheduledGame[];
  startDate: string;
};

function formatPeriod(startDate: string, endDate: string) {
  return `${dayjs(startDate).format("D MMM YYYY")} — ${
    endDate ? dayjs(endDate).format("D MMM YYYY") : "Choose end date"
  }`;
}

export function SchedulePeriodEditor({
  currentScheduleId,
  disabled,
  endDate,
  getGameName,
  onChange,
  renderScheduledGameDay,
  scheduledGames,
  startDate
}: SchedulePeriodEditorProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const [month, setMonth] = useState(() => dayjs(startDate));
  const [initialPeriod] = useState(() => ({ endDate, startDate }));
  const otherScheduledGames = scheduledGames.filter((game) => game.id !== currentScheduleId);
  const startDay = startDate ? dayjs(startDate) : undefined;
  const endDay = endDate ? dayjs(endDate) : undefined;
  const selectionStep = endDay ? "start" : "end";
  const selectedPeriod: SchedulePeriod | undefined =
    startDate && endDate ? { endDate, label: formatPeriod(startDate, endDate), startDate } : undefined;
  const availability = selectedPeriod
    ? getSchedulePeriodAvailability(otherScheduledGames, startDate, endDate)
    : undefined;

  const closeConflict = () => {
    setIsConflictOpen(false);
    onChange(initialPeriod.startDate, initialPeriod.endDate);
  };

  const selectPeriod = (nextStartDate: string, nextEndDate: string) => {
    onChange(nextStartDate, nextEndDate);
    setIsConflictOpen(false);
    setIsEditorOpen(false);
  };

  const selectDay = (day: Dayjs) => {
    const nextStartDate = day.format("YYYY-MM-DD");

    if (selectionStep === "start" || startDay === undefined || day.isBefore(startDay, "day")) {
      onChange(nextStartDate, "");
      setMonth(day);

      return;
    }

    const nextEndDate = day.format("YYYY-MM-DD");
    const nextAvailability = getSchedulePeriodAvailability(otherScheduledGames, startDate, nextEndDate);

    onChange(startDate, nextEndDate);

    if (nextAvailability.conflicts.length) {
      setIsConflictOpen(true);

      return;
    }

    setIsEditorOpen(false);
  };

  const renderDayContent = (day: Dayjs) => {
    const game = scheduledGames.find(
      (scheduledGame) =>
        !day.isBefore(scheduledGame.startDate, "day") && !day.isAfter(scheduledGame.endDate, "day")
    );

    return game ? renderScheduledGameDay(game.gameId) : null;
  };

  return (
    <section className="schedule-period-editor" aria-label="Rule period">
      <ButtonBase
        type="button"
        aria-expanded={isEditorOpen}
        className="schedule-period-editor__summary"
        disabled={disabled}
        onClick={() => setIsEditorOpen((isOpen) => !isOpen)}
      >
        <span>{formatPeriod(startDate, endDate)}</span>
        <span className="schedule-period-editor__action">
          {isEditorOpen ? "Hide calendar" : "Edit period"}
        </span>
      </ButtonBase>

      {isEditorOpen ? (
        <div className="schedule-period-editor__calendar">
          <CalendarMonth
            isCompact
            month={month}
            onDayClick={disabled ? undefined : selectDay}
            onMonthChange={setMonth}
            renderDayContent={renderDayContent}
            selectedEndDay={endDay}
            selectedStartDay={startDay}
          />
          <p className="schedule-period-editor__instruction" aria-live="polite">
            {selectionStep === "start" ? "Choose a new start date" : "Choose an end date"}
          </p>
        </div>
      ) : null}

      {isConflictOpen && selectedPeriod && availability ? (
        <Modal
          ariaLabel="Schedule conflict"
          className="schedule-period-editor__conflict-modal"
          hasOverlay
          isOpen
          onClose={closeConflict}
        >
          <SchedulePeriodConflict
            availablePeriods={availability.availablePeriods}
            conflicts={availability.conflicts}
            getGameName={getGameName}
            onClose={closeConflict}
            onPeriodSelect={(period) => selectPeriod(period.startDate, period.endDate)}
            period={selectedPeriod}
          />
        </Modal>
      ) : null}
    </section>
  );
}
