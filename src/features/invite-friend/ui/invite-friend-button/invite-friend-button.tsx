import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { useInviteFriend } from "../../model/use-invite-friend";

import "./invite-friend-button.scss";

type InviteFriendButtonProps = {
  onStatusMessageChange?: (message: string) => void;
};

export function InviteFriendButton({ onStatusMessageChange }: InviteFriendButtonProps) {
  const { t } = useTranslation();
  const { inviteFriend, statusMessage } = useInviteFriend();

  useEffect(() => {
    onStatusMessageChange?.(statusMessage);
  }, [onStatusMessageChange, statusMessage]);

  return (
    <button className="invite-friend-button" type="button" onClick={() => inviteFriend()}>
      {t("attempts.status.get")}
    </button>
  );
}
