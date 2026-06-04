import "./open-telegram-button.scss";

type OpenTelegramButtonProps = {
  onClick: () => void;
};

export default function OpenTelegramButton({ onClick }: OpenTelegramButtonProps) {
  return (
    <section className="open-telegram-button">
      <button className="open-telegram-button__control" type="button" onClick={onClick}>
        Открыть в Telegram
      </button>
    </section>
  );
}
