import { useCallback } from "react";
import { LotteryCodePanel, LotteryScene } from "@/entities/lottery";
import { useLotteryCodeCheckFlow } from "@/features/check-lottery-combination";
import {
  ChannelSubscriptionModal,
  useChannelSubscriptionRequirement
} from "@/features/require-channel-subscription";
import "./lottery-widget-scene.scss";

type LotteryWidgetSceneProps = {
  onAssetsReady?: () => void;
};

export function LotteryWidgetScene({ onAssetsReady }: LotteryWidgetSceneProps) {
  const { checkCombination, checkError, clearCheckError, isChecking } = useLotteryCodeCheckFlow();
  const {
    canOpenChannel,
    clearSubscriptionError,
    closeModal,
    isLoading: isCheckingSubscription,
    isModalOpen,
    openChannel,
    runWhenSubscribed,
    subscriptionError
  } = useChannelSubscriptionRequirement();
  const isLoading = isChecking || isCheckingSubscription;
  const visibleError = subscriptionError ?? checkError;

  const handleCheck = useCallback(
    (digits: string[]) => {
      const digitsToCheck = [...digits];

      void runWhenSubscribed(() => checkCombination(digitsToCheck)).catch(() => undefined);
    },
    [checkCombination, runWhenSubscribed]
  );

  const handleCodeChange = useCallback(() => {
    clearCheckError();
    clearSubscriptionError();
  }, [clearCheckError, clearSubscriptionError]);

  const codePanel = (
    <>
      <LotteryCodePanel
        hideSelectedDigitsFromOtherColumns
        isChecking={isLoading}
        onCheck={handleCheck}
        onCodeChange={handleCodeChange}
      />

      {visibleError && !isModalOpen ? (
        <p className="lottery-widget-scene__check-error" role="status">
          {visibleError}
        </p>
      ) : null}

      <ChannelSubscriptionModal
        canOpenChannel={canOpenChannel}
        error={subscriptionError}
        isLoading={isCheckingSubscription}
        isOpen={isModalOpen}
        onClose={closeModal}
        onOpenChannel={openChannel}
      />
    </>
  );

  return <LotteryScene codePanel={codePanel} onAssetsReady={onAssetsReady} />;
}
