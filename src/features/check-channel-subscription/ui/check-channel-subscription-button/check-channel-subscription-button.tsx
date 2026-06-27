import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { useCheckChannelSubscription } from "../../model/use-check-channel-subscription";

import "./check-channel-subscription-button.scss";

type CheckChannelSubscriptionButtonProps = {
  isCompleted: boolean;
  onStatusMessageChange?: (message: string) => void;
};

export function CheckChannelSubscriptionButton({
  isCompleted,
  onStatusMessageChange
}: CheckChannelSubscriptionButtonProps) {
  const { t } = useTranslation();
  const { checkSubscription, isChecking, statusMessage } = useCheckChannelSubscription();

  const isDisabled = isCompleted || isChecking;
  const label = isCompleted
    ? t("attempts.status.completed")
    : isChecking
      ? t("attempts.status.requesting")
      : t("attempts.status.get");

  useEffect(() => {
    onStatusMessageChange?.(statusMessage);
  }, [onStatusMessageChange, statusMessage]);

  return (
    <button
      aria-busy={isChecking}
      className="check-channel-subscription-button"
      type="button"
      disabled={isDisabled}
      onClick={() => void checkSubscription()}
    >
      {label}
    </button>
  );
}
