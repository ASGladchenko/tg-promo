import { useId } from "react";

import { GameScheduleId } from "@/entities/game-schedule";

import { scheduleGameMetadata } from "../../model/schedule-game-metadata";

import "./schedule-game-picker.scss";

type ScheduleGamePickerProps = {
  onClose: () => void;
  onGameClick: (gameId: GameScheduleId) => void;
  periodLabel?: string;
};

export function ScheduleGamePicker({ onClose, onGameClick, periodLabel }: ScheduleGamePickerProps) {
  const titleId = useId();

  return (
    <section className="admin-modal-form schedule-game-picker" aria-labelledby={titleId}>
      <div className="admin-modal-form__header">
        <div>
          <p className="admin-modal-form__eyebrow">Period</p>
          <h2 id={titleId} className="admin-modal-form__title">
            Choose game
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close schedule period modal"
          className="admin-modal-form__close"
        >
          <span className="admin-modal-form__close-icon" aria-hidden="true" />
        </button>
      </div>

      <div className="admin-modal-form__content">
        <div className="schedule-game-picker__content">
          <p className="schedule-game-picker__period" aria-live="polite">
            {periodLabel}
          </p>

          <div className="schedule-game-picker__options" role="group" aria-label="Available games">
            {Object.entries(scheduleGameMetadata).map(([id, game]) => {
              const gameId = id as GameScheduleId;

              return (
                <button
                  key={gameId}
                  type="button"
                  className="schedule-game-picker__option"
                  onClick={() => onGameClick(gameId)}
                >
                  <span className="schedule-game-picker__mark" aria-hidden="true">
                    {game.mark}
                  </span>

                  <span className="schedule-game-picker__copy">
                    <strong className="schedule-game-picker__name">{game.title}</strong>
                    <span className="schedule-game-picker__description">{game.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="schedule-game-picker__hint">
            More game rule settings will appear here as they are added.
          </p>
        </div>
      </div>
    </section>
  );
}
