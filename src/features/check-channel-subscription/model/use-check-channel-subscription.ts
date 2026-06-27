import { useCallback, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { setAttemptsWalletQueryData } from "@/entities/attempts";
import { patchMeQueryData } from "@/entities/me";
import { checkChannelSubscription } from "@/entities/tg";
import { PUBLIC_ENV } from "@/shared/config";
import { useRetryOnAppReturn } from "@/shared/lib/browser";
import { triggerErrorHapticFeedback, triggerRigidHapticFeedback } from "@/shared/lib/telegram";
import { notify } from "@/shared/lib/toast";

type CheckChannelSubscriptionResult = "confirmed" | "error" | "missing-url" | "opened";

type CheckChannelSubscriptionOptions = {
  shouldOpenChannel?: boolean;
};

function openTelegramChannel(channelUrl: string): void {
  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(channelUrl);
    return;
  }

  window.open(channelUrl, "_blank", "noopener,noreferrer");
}

export function useCheckChannelSubscription() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isChecking, setIsChecking] = useState(false);
  const [isAwaitingAppReturn, setIsAwaitingAppReturn] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const isCheckingRef = useRef(false);
  const channelUrl = PUBLIC_ENV.TELEGRAM_CHANNEL_URL;

  const setCheckingState = useCallback((value: boolean) => {
    isCheckingRef.current = value;
    setIsChecking(value);
  }, []);

  const checkSubscription = useCallback(
    async ({ shouldOpenChannel = true }: CheckChannelSubscriptionOptions = {}): Promise<
      CheckChannelSubscriptionResult | undefined
    > => {
      if (isCheckingRef.current) {
        return undefined;
      }

      setCheckingState(true);
      setStatusMessage("");

      try {
        const response = await checkChannelSubscription();

        patchMeQueryData(queryClient, { isChannelSubscribed: response.isChannelSubscribed });

        if (response.isChannelSubscribed) {
          setAttemptsWalletQueryData(queryClient, response.wallet);
          setIsAwaitingAppReturn(false);

          const successMessage = response.channelBonusGranted
            ? t("attempts.channelSubscription.bonusGranted")
            : t("attempts.channelSubscription.confirmed");

          setStatusMessage(successMessage);
          triggerRigidHapticFeedback();

          if (response.channelBonusGranted) {
            notify.success(successMessage);
          }

          return "confirmed";
        }

        if (!shouldOpenChannel) {
          setStatusMessage(t("attempts.channelSubscription.opened"));
          return "opened";
        }

        if (!channelUrl) {
          setStatusMessage(t("subscription.noChannelUrl"));
          triggerErrorHapticFeedback();
          return "missing-url";
        }

        setIsAwaitingAppReturn(true);
        openTelegramChannel(channelUrl);
        setStatusMessage(t("attempts.channelSubscription.opened"));

        return "opened";
      } catch {
        setStatusMessage(t("subscription.errors.checkMembership"));
        setIsAwaitingAppReturn(false);
        triggerErrorHapticFeedback();

        return "error";
      } finally {
        setCheckingState(false);
      }
    },
    [channelUrl, queryClient, setCheckingState, t]
  );

  const retrySubscriptionCheck = useCallback(() => {
    void checkSubscription({ shouldOpenChannel: false });
  }, [checkSubscription]);

  useRetryOnAppReturn({
    enabled: isAwaitingAppReturn,
    onReturn: retrySubscriptionCheck
  });

  const clearStatusMessage = useCallback(() => {
    setStatusMessage("");
  }, []);

  return {
    checkSubscription,
    clearStatusMessage,
    isChecking,
    statusMessage
  };
}
