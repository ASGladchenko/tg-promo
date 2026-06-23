import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useRequestTelegramContact } from "../../model/use-request-telegram-contact";

import "./request-telegram-contact-button.scss";

type RequestTelegramContactButtonProps = {
  hasPhone: boolean;
  onContactSent?: () => void;
  onStatusMessageChange?: (message: string) => void;
};

export function RequestTelegramContactButton({
  hasPhone,
  onContactSent,
  onStatusMessageChange
}: RequestTelegramContactButtonProps) {
  const { t } = useTranslation();
  const { isRequesting, requestContact, statusMessage } = useRequestTelegramContact();
  const [isSent, setIsSent] = useState<boolean>(false);

  const isDisabled = hasPhone || isRequesting || isSent;
  const label = hasPhone
    ? t("attempts.status.completed")
    : isRequesting || isSent
      ? t("attempts.status.requesting")
      : t("attempts.status.get");

  useEffect(() => {
    onStatusMessageChange?.(statusMessage);
  }, [onStatusMessageChange, statusMessage]);

  async function handleClick() {
    const result = await requestContact();

    if (result === "sent") {
      onContactSent?.();
      setIsSent(true);
      return;
    }
    setIsSent(false);
  }

  return (
    <button
      aria-busy={isRequesting}
      className="request-telegram-contact-button"
      type="button"
      disabled={isDisabled}
      onClick={() => void handleClick()}
    >
      {label}
    </button>
  );
}
