import { useCallback, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  AttemptRewardActionButton,
  AttemptRewardCard,
  AttemptsWalletModal,
  AttemptsWalletTrigger,
  MOCK_REWARDS,
  useAttemptsWallet,
  useAttemptsWalletStore
} from "@/entities/attempts";
import { useMe } from "@/entities/me";
import { CheckChannelSubscriptionButton } from "@/features/check-channel-subscription";
import { RequestTelegramContactButton } from "@/features/request-telegram-contact";

import "./attempts-wallet-widget.scss";

export function AttemptsWalletWidget() {
  const { t } = useTranslation();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const [statusMessage, setStatusMessage] = useState("");
  const [channelSubscriptionStatusMessage, setChannelSubscriptionStatusMessage] = useState("");
  const [contactStatusMessage, setContactStatusMessage] = useState("");
  const isWalletOpen = useAttemptsWalletStore((state) => state.isWalletOpen);
  const openWallet = useAttemptsWalletStore((state) => state.openWallet);
  const closeWallet = useAttemptsWalletStore((state) => state.closeWallet);
  const { data: me } = useMe({ enabled: false });
  const { data: wallet } = useAttemptsWallet({ enabled: false });

  const hasPhone = Boolean(me?.phone);
  const isChannelBonusGranted = wallet?.isChannelBonusGranted === true;

  function handleOpenWallet() {
    setStatusMessage("");
    setChannelSubscriptionStatusMessage("");
    setContactStatusMessage("");
    openWallet();
  }

  function handleCloseWallet() {
    closeWallet();
    setStatusMessage("");
    setChannelSubscriptionStatusMessage("");
    setContactStatusMessage("");
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleRewardAction() {
    setChannelSubscriptionStatusMessage("");
    setContactStatusMessage("");
    setStatusMessage(t("attempts.comingSoonMessage"));
  }

  const handleContactStatusMessageChange = useCallback((message: string) => {
    setStatusMessage("");
    setChannelSubscriptionStatusMessage("");
    setContactStatusMessage(message);
  }, []);

  const handleChannelSubscriptionStatusMessageChange = useCallback((message: string) => {
    setStatusMessage("");
    setContactStatusMessage("");
    setChannelSubscriptionStatusMessage(message);
  }, []);

  const walletData = wallet ? { ...wallet, ...MOCK_REWARDS } : null;

  return (
    <section className="attempts-wallet-widget" aria-label={t("attempts.walletLabel")}>
      <div className="attempts-wallet-widget__trigger">
        <AttemptsWalletTrigger
          ref={triggerRef}
          isExpanded={isWalletOpen}
          totalAttempts={wallet?.totalAttempts ?? "-"}
          onClick={handleOpenWallet}
        />
      </div>

      <AttemptsWalletModal
        data={walletData}
        isOpen={isWalletOpen}
        onClose={handleCloseWallet}
        statusMessage={contactStatusMessage || channelSubscriptionStatusMessage || statusMessage}
      >
        {walletData?.rewards.map((reward) => {
          const rewardCard = {
            ...reward,
            status:
              (reward.kind === "add-phone" && hasPhone) ||
              (reward.kind === "subscribe-channel" && isChannelBonusGranted)
                ? "completed"
                : reward.status
          };

          return (
            <AttemptRewardCard key={reward.id} reward={rewardCard}>
              {reward.kind === "add-phone" ? (
                <RequestTelegramContactButton
                  hasPhone={hasPhone}
                  onStatusMessageChange={handleContactStatusMessageChange}
                />
              ) : reward.kind === "subscribe-channel" ? (
                <CheckChannelSubscriptionButton
                  isCompleted={isChannelBonusGranted}
                  onStatusMessageChange={handleChannelSubscriptionStatusMessageChange}
                />
              ) : (
                <AttemptRewardActionButton status={reward.status} onClick={handleRewardAction} />
              )}
            </AttemptRewardCard>
          );
        })}
      </AttemptsWalletModal>
    </section>
  );
}
