import { useCallback, useState } from "react";

import { useTranslation } from "react-i18next";

import { useMe } from "@/entities/me";
import { PUBLIC_ENV } from "@/shared/config";
import { triggerErrorHapticFeedback, triggerRigidHapticFeedback } from "@/shared/lib/telegram";

type InviteFriendResult = "error" | "missing-participant-id" | "missing-url" | "opened";

const DEFAULT_START_PARAM = "play";
const REFERRAL_START_PARAM_SEPARATOR = "_ref_";
const TELEGRAM_NATIVE_SHARE_URL = "tg://msg_url";
const TELEGRAM_SHARE_URL = "https://t.me/share/url";

function buildReferralStartParam(startParam: string | null, participantId: string): string {
  const normalizedStartParam = startParam?.trim() || DEFAULT_START_PARAM;
  const [baseStartParam] = normalizedStartParam.split(REFERRAL_START_PARAM_SEPARATOR);

  return `${baseStartParam || DEFAULT_START_PARAM}${REFERRAL_START_PARAM_SEPARATOR}${participantId}`;
}

function buildReferralMiniAppUrl(baseMiniAppUrl: string, participantId: string): string {
  const miniAppUrl = new URL(baseMiniAppUrl);

  miniAppUrl.searchParams.set(
    "startapp",
    buildReferralStartParam(miniAppUrl.searchParams.get("startapp"), participantId)
  );

  return miniAppUrl.toString();
}

function buildTelegramShareUrl(gameUrl: string, text: string): string {
  return `${TELEGRAM_SHARE_URL}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(gameUrl)}`;
}

function buildTelegramNativeShareUrl(gameUrl: string, text: string): string {
  return `${TELEGRAM_NATIVE_SHARE_URL}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(gameUrl)}`;
}

function openTelegramShare(shareUrl: string, nativeShareUrl: string): void {
  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(shareUrl);
    return;
  }

  const openedWindow = window.open(nativeShareUrl, "_blank", "noopener,noreferrer");

  if (!openedWindow) {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }
}

export function useInviteFriend() {
  const { t } = useTranslation();
  const { data: me } = useMe({ enabled: false });
  const [statusMessage, setStatusMessage] = useState("");

  const inviteFriend = useCallback((): InviteFriendResult => {
    const participantId = me?.id.trim();

    setStatusMessage("");

    if (!participantId) {
      setStatusMessage(t("attempts.inviteFriend.errors.noParticipantId"));
      triggerErrorHapticFeedback();
      return "missing-participant-id";
    }

    if (!PUBLIC_ENV.TELEGRAM_SHARE_URL) {
      setStatusMessage(t("attempts.inviteFriend.errors.noShareUrl"));
      triggerErrorHapticFeedback();
      return "missing-url";
    }

    try {
      const gameUrl = buildReferralMiniAppUrl(PUBLIC_ENV.TELEGRAM_SHARE_URL, participantId);
      const shareText = t("attempts.inviteFriend.shareText");
      const shareUrl = buildTelegramShareUrl(gameUrl, shareText);
      const nativeShareUrl = buildTelegramNativeShareUrl(gameUrl, shareText);

      openTelegramShare(shareUrl, nativeShareUrl);
      setStatusMessage(t("attempts.inviteFriend.opened"));
      triggerRigidHapticFeedback();

      return "opened";
    } catch {
      setStatusMessage(t("attempts.inviteFriend.errors.share"));
      triggerErrorHapticFeedback();
      return "error";
    }
  }, [me?.id, t]);

  return {
    inviteFriend,
    statusMessage
  };
}
