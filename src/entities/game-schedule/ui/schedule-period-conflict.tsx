import { useId } from "react";

import { ButtonBase } from "@/shared/ui/button-base";

import { type SchedulePeriod, type SchedulePeriodConflict } from "../lib/get-schedule-period-availability";
import { GameScheduleId } from "../model/types";

import "./schedule-period-conflict.scss";

type SchedulePeriodConflictProps = {
  availablePeriods: readonly SchedulePeriod[];
  conflicts: readonly SchedulePeriodConflict[];
  getGameName: (gameId: GameScheduleId) => string;
  onClose: () => void;
  onPeriodSelect: (period: SchedulePeriod) => void;
  period: SchedulePeriod;
};

export function SchedulePeriodConflict({
  availablePeriods,
  conflicts,
  getGameName,
  onClose,
  onPeriodSelect,
  period
}: SchedulePeriodConflictProps) {
  const titleId = useId();
  const hasAvailablePeriods = availablePeriods.length > 0;

  return (
    <section className="admin-modal-form schedule-period-conflict" aria-labelledby={titleId}>
      <div className="admin-modal-form__header">
        <div>
          <p className="admin-modal-form__eyebrow">Schedule conflict</p>
          <h2 id={titleId} className="admin-modal-form__title">
            {hasAvailablePeriods ? "Choose an available period" : "Period is unavailable"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close schedule conflict modal"
          className="admin-modal-form__close"
        >
          <span className="admin-modal-form__close-icon" aria-hidden="true" />
        </button>
      </div>

      <div className="admin-modal-form__content schedule-period-conflict__content">
        <div className="schedule-period-conflict__notice" role="alert">
          <span className="schedule-period-conflict__icon" aria-hidden="true">
            !
          </span>
          <div>
            <p className="schedule-period-conflict__period">{period.label}</p>
            <p className="schedule-period-conflict__message">
              An existing rule splits this period into unavailable dates.
            </p>
          </div>
        </div>

        <ul className="schedule-period-conflict__conflicts" aria-label="Unavailable dates">
          {conflicts.map((conflict) => (
            <li key={conflict.dateLabel}>
              <time>{conflict.dateLabel}</time>
              <span>{getGameName(conflict.gameId)}</span>
            </li>
          ))}
        </ul>

        {hasAvailablePeriods ? (
          <div className="schedule-period-conflict__options" role="group" aria-label="Available periods">
            {availablePeriods.map((availablePeriod) => (
              <ButtonBase
                key={availablePeriod.startDate}
                type="button"
                className="schedule-period-conflict__option"
                onClick={() => onPeriodSelect(availablePeriod)}
              >
                {availablePeriod.label}
              </ButtonBase>
            ))}
          </div>
        ) : null}

        <ButtonBase type="button" variant="warning" onClick={onClose}>
          Choose another period
        </ButtonBase>
      </div>
    </section>
  );
}
