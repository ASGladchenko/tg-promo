import { useId } from "react";

import { GameScheduleId } from "@/entities/game-schedule";
import { ButtonBase } from "@/shared/ui/button-base";

import { type ScheduledGameConflict, type ScheduledGamePeriod } from "../lib/get-scheduled-game-conflicts";

import "./admin-lucky-meadow-rule-period-conflict.scss";

type AdminLuckyMeadowRulePeriodConflictProps = {
  availablePeriods: readonly ScheduledGamePeriod[];
  conflicts: readonly ScheduledGameConflict[];
  getGameName: (gameId: GameScheduleId) => string;
  onClose: () => void;
  onPeriodSelect: (period: ScheduledGamePeriod) => void;
  period: ScheduledGamePeriod;
};

export function AdminLuckyMeadowRulePeriodConflict({
  availablePeriods,
  conflicts,
  getGameName,
  onClose,
  onPeriodSelect,
  period
}: AdminLuckyMeadowRulePeriodConflictProps) {
  const titleId = useId();
  const hasAvailablePeriods = availablePeriods.length > 0;

  return (
    <section className="admin-modal-form admin-lucky-meadow-rule-period-conflict" aria-labelledby={titleId}>
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

      <div className="admin-modal-form__content admin-lucky-meadow-rule-period-conflict__content">
        <div className="admin-lucky-meadow-rule-period-conflict__notice" role="alert">
          <span className="admin-lucky-meadow-rule-period-conflict__icon" aria-hidden="true">
            !
          </span>
          <div>
            <p className="admin-lucky-meadow-rule-period-conflict__period">{period.label}</p>
            <p className="admin-lucky-meadow-rule-period-conflict__message">
              An existing rule splits this period into unavailable dates.
            </p>
          </div>
        </div>

        <ul className="admin-lucky-meadow-rule-period-conflict__conflicts" aria-label="Unavailable dates">
          {conflicts.map((conflict) => (
            <li key={conflict.dateLabel}>
              <time>{conflict.dateLabel}</time>
              <span>{getGameName(conflict.gameId)}</span>
            </li>
          ))}
        </ul>

        {hasAvailablePeriods ? (
          <div
            className="admin-lucky-meadow-rule-period-conflict__options"
            role="group"
            aria-label="Available periods"
          >
            {availablePeriods.map((availablePeriod) => (
              <ButtonBase
                key={availablePeriod.startDate}
                type="button"
                className="admin-lucky-meadow-rule-period-conflict__option"
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
