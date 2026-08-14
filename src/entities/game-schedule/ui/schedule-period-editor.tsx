import { type ReactNode } from "react";

import { ButtonBase } from "@/shared/ui/button-base";
import { CalendarMonth } from "@/shared/ui/calendar-month";
import { Modal } from "@/shared/ui/modal";

import { GameScheduleId } from "../model/types";
import { useSchedulePeriodEditor } from "../model/use-schedule-period-editor";
import { SchedulePeriodConflict } from "./schedule-period-conflict";

import "./schedule-period-editor.scss";

type SchedulePeriodEditorProps = {
  currentStartDate: string;
  disabled: boolean;
  endDate: string;
  getGameName: (gameId: GameScheduleId) => string;
  onChange: (startDate: string, endDate: string) => void;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
  startDate: string;
};

export function SchedulePeriodEditor({
  currentStartDate,
  disabled,
  endDate,
  getGameName,
  onChange,
  renderScheduledGameDay,
  startDate
}: SchedulePeriodEditorProps) {
  const editor = useSchedulePeriodEditor({ currentStartDate, disabled, endDate, onChange, startDate });

  return (
    <section className="schedule-period-editor" aria-label="Rule period">
      <ButtonBase
        type="button"
        aria-expanded={editor.isEditorOpen}
        className="schedule-period-editor__summary"
        disabled={disabled}
        onClick={() => editor.setIsEditorOpen((isOpen) => !isOpen)}
      >
        <span>{editor.periodLabel}</span>
        <span className="schedule-period-editor__action">
          {editor.isEditorOpen ? "Hide calendar" : "Edit period"}
        </span>
      </ButtonBase>

      {editor.isEditorOpen ? (
        <div className="schedule-period-editor__calendar">
          <CalendarMonth
            isCompact
            month={editor.month}
            onDayClick={editor.isCalendarDisabled ? undefined : editor.selectDay}
            onMonthChange={editor.setMonth}
            renderDayContent={(day) => {
              const game = editor.getScheduledGameForDay(day);

              return game ? renderScheduledGameDay(game.gameId) : null;
            }}
            selectedEndDay={editor.endDay}
            selectedStartDay={editor.startDay}
          />
          <p className="schedule-period-editor__instruction" aria-live="polite">
            {editor.isSelectingStart ? "Choose a new start date" : "Choose an end date"}
          </p>
        </div>
      ) : null}

      {editor.isConflictOpen && editor.selectedPeriod && editor.availability ? (
        <Modal
          ariaLabel="Schedule conflict"
          className="schedule-period-editor__conflict-modal"
          hasOverlay
          isOpen
          onClose={editor.closeConflict}
        >
          <SchedulePeriodConflict
            availablePeriods={editor.availability.availablePeriods}
            conflicts={editor.availability.conflicts}
            getGameName={getGameName}
            onClose={editor.closeConflict}
            onPeriodSelect={(period) => editor.selectPeriod(period.startDate, period.endDate)}
            period={editor.selectedPeriod}
          />
        </Modal>
      ) : null}
    </section>
  );
}
