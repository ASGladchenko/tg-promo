import { useId } from "react";

import { ADMIN_SCHEDULE_GAME_DETAILS, AdminScheduleGameId } from "../../model/admin-schedule-game";

import "./schedule-game-picker.scss";

const SCHEDULE_GAME_OPTIONS = [
  {
    description: "Open rule settings for this period.",
    id: AdminScheduleGameId.CrackSafe,
    isAvailable: true
  },
  {
    description: "Rule settings will be available soon.",
    id: AdminScheduleGameId.LuckyMeadow,
    isAvailable: false
  }
] as const;

type ScheduleGamePickerProps = {
  onClose: () => void;
  onGameClick: (gameId: AdminScheduleGameId) => void;
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
            {SCHEDULE_GAME_OPTIONS.map((game) => {
              const gameDetails = ADMIN_SCHEDULE_GAME_DETAILS[game.id];

              return (
                <button
                  key={game.id}
                  type="button"
                  className="schedule-game-picker__option"
                  disabled={!game.isAvailable}
                  onClick={game.isAvailable ? () => onGameClick(game.id) : undefined}
                >
                  <span className="schedule-game-picker__mark" aria-hidden="true">
                    {gameDetails.mark}
                  </span>

                  <span className="schedule-game-picker__copy">
                    <strong className="schedule-game-picker__name">{gameDetails.name}</strong>
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
