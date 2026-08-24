import "./game-unavailable-placeholder.scss";

type GameUnavailablePlaceholderProps = {
  ariaLabel: string;
  message: string;
};

export function GameUnavailablePlaceholder({ ariaLabel, message }: GameUnavailablePlaceholderProps) {
  return (
    <section className="game-unavailable-placeholder" aria-label={ariaLabel}>
      <div className="game-unavailable-placeholder__panel" role="status">
        <p className="game-unavailable-placeholder__message">{message}</p>
      </div>
    </section>
  );
}
