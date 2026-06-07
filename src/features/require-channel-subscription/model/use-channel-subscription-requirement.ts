import { useCallback, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { checkChannelMembership } from "@/entities/tg";
import { PUBLIC_ENV } from "@/shared/config";
import { triggerErrorHapticFeedback } from "@/shared/lib/telegram";

import { useRetryOnAppReturn } from "./use-retry-on-app-return";

type PendingAction = () => Promise<void>;

export function useChannelSubscriptionRequirement() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAwaitingAppReturn, setIsAwaitingAppReturn] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const pendingActionRef = useRef<PendingAction | null>(null);
  const isLoadingRef = useRef(false);
  const channelUrl = PUBLIC_ENV.TELEGRAM_CHANNEL_URL;

  const setLoadingState = useCallback((value: boolean) => {
    isLoadingRef.current = value;
    setIsLoading(value);
  }, []);

  const runWhenSubscribed = useCallback(
    async (action: PendingAction) => {
      if (isLoadingRef.current) {
        return;
      }

      setLoadingState(true);
      setSubscriptionError(null);

      let isMember: boolean;

      try {
        isMember = await checkChannelMembership();
      } catch (error) {
        setSubscriptionError(t("subscription.errors.checkMembership"));
        triggerErrorHapticFeedback();
        setLoadingState(false);
        throw error;
      }

      if (!isMember) {
        pendingActionRef.current = action;
        setIsModalOpen(true);
        setLoadingState(false);
        return;
      }

      pendingActionRef.current = null;
      setIsAwaitingAppReturn(false);
      setIsModalOpen(false);

      try {
        await action();
      } finally {
        setLoadingState(false);
      }
    },
    [setLoadingState, t]
  );

  const retryPendingAction = useCallback(() => {
    const pendingAction = pendingActionRef.current;

    if (!pendingAction || isLoadingRef.current) {
      return;
    }

    void runWhenSubscribed(pendingAction).catch(() => undefined);
  }, [runWhenSubscribed]);

  useRetryOnAppReturn({
    enabled: isModalOpen && isAwaitingAppReturn,
    onReturn: retryPendingAction
  });

  const closeModal = useCallback(() => {
    pendingActionRef.current = null;
    setIsAwaitingAppReturn(false);
    setIsModalOpen(false);
    setSubscriptionError(null);
  }, []);

  const openChannel = useCallback(() => {
    if (!channelUrl) {
      return;
    }

    setIsAwaitingAppReturn(true);

    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(channelUrl);
      return;
    }

    window.open(channelUrl, "_blank", "noopener,noreferrer");
  }, [channelUrl]);

  const clearSubscriptionError = useCallback(() => {
    setSubscriptionError(null);
  }, []);

  return {
    canOpenChannel: Boolean(channelUrl),
    clearSubscriptionError,
    closeModal,
    isLoading,
    isModalOpen,
    openChannel,
    runWhenSubscribed,
    subscriptionError
  };
}
