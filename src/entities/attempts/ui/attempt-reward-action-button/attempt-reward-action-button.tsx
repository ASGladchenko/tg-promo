import { useTranslation } from "react-i18next";

import { type AttemptRewardStatus } from "../../model/types";

import "./attempt-reward-action-button.scss";

type AttemptRewardActionButtonProps = {
  isPending?: boolean;
  onClick?: () => void;
  status: AttemptRewardStatus;
};

export function AttemptRewardActionButton({
  isPending = false,
  onClick,
  status
}: AttemptRewardActionButtonProps) {
  const { t } = useTranslation();
  const isAvailable = status === "available";

  const label = isPending
    ? t("attempts.status.requesting")
    : status === "completed"
      ? t("attempts.status.completed")
      : status === "coming-soon"
        ? t("attempts.status.comingSoon")
        : t("attempts.status.get");

  return (
    <button
      aria-busy={isPending}
      className="attempt-reward-action-button"
      type="button"
      disabled={!isAvailable || isPending}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
