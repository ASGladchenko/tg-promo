import { type ReactNode } from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { type AttemptReward, type AttemptRewardKind } from "../../model/types";

import "./attempt-reward-card.scss";

type AttemptRewardCardProps = {
  children: ReactNode;
  reward: AttemptReward;
};

const REWARD_TRANSLATION_KEYS: Record<
  AttemptRewardKind,
  "inviteFriend" | "confirmEmail" | "addPhone" | "subscribeChannel"
> = {
  "invite-friend": "inviteFriend",
  "confirm-email": "confirmEmail",
  "add-phone": "addPhone",
  "subscribe-channel": "subscribeChannel"
};

export function AttemptRewardCard({ children, reward }: AttemptRewardCardProps) {
  const { t } = useTranslation();
  const translationKey = REWARD_TRANSLATION_KEYS[reward.kind];

  return (
    <li
      className={clsx("attempt-reward-card", {
        "attempt-reward-card--completed": reward.status === "completed"
      })}
    >
      <span className="attempt-reward-card__badge">+{reward.attempts}</span>
      <span className="attempt-reward-card__copy">
        <strong className="attempt-reward-card__title">
          {t(`attempts.rewards.${translationKey}.title`)}
        </strong>
        <span className="attempt-reward-card__description">
          {t(`attempts.rewards.${translationKey}.description`)}
        </span>
      </span>
      <div className="attempt-reward-card__action">{children}</div>
    </li>
  );
}
