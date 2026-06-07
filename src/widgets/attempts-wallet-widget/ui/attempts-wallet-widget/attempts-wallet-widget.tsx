import { useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  AttemptRewardActionButton,
  AttemptRewardCard,
  AttemptsWalletModal,
  AttemptsWalletTrigger,
  DEMO_ATTEMPTS_WALLET_DATA,
  useAttemptsWalletStore
} from "@/entities/attempts";

import "./attempts-wallet-widget.scss";

const walletData = DEMO_ATTEMPTS_WALLET_DATA;

export function AttemptsWalletWidget() {
  const { t } = useTranslation();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const isWalletOpen = useAttemptsWalletStore((state) => state.isWalletOpen);
  const openWallet = useAttemptsWalletStore((state) => state.openWallet);
  const closeWallet = useAttemptsWalletStore((state) => state.closeWallet);
  const totalAttempts = walletData.permanentAttempts + walletData.dailyAttempts;

  function handleOpenWallet() {
    setStatusMessage("");
    openWallet();
  }

  function handleCloseWallet() {
    closeWallet();
    setStatusMessage("");
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleRewardAction() {
    setStatusMessage(t("attempts.comingSoonMessage"));
  }

  return (
    <section className="attempts-wallet-widget" aria-label={t("attempts.walletLabel")}>
      <div className="attempts-wallet-widget__trigger">
        <AttemptsWalletTrigger
          ref={triggerRef}
          isExpanded={isWalletOpen}
          totalAttempts={totalAttempts}
          onClick={handleOpenWallet}
        />
      </div>

      <AttemptsWalletModal
        data={walletData}
        isOpen={isWalletOpen}
        onClose={handleCloseWallet}
        statusMessage={statusMessage}
      >
        {walletData.rewards.map((reward) => (
          <AttemptRewardCard key={reward.id} reward={reward}>
            <AttemptRewardActionButton status={reward.status} onClick={handleRewardAction} />
          </AttemptRewardCard>
        ))}
      </AttemptsWalletModal>
    </section>
  );
}
