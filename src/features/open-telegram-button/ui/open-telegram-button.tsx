import { useTranslation } from "react-i18next";
import "./open-telegram-button.scss";

type OpenTelegramButtonProps = {
  onClick: () => void;
};

export function OpenTelegramButton({ onClick }: OpenTelegramButtonProps) {
  const { t } = useTranslation();

  return (
    <section className="open-telegram-button">
      <button className="open-telegram-button__control" type="button" onClick={onClick}>
        {t("telegram.open")}
      </button>
    </section>
  );
}
