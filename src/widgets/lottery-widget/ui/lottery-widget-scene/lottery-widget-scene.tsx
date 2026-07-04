import { useCallback, useState } from "react";

import {
  LotteryCodePanel,
  LotteryScene,
  useLotteryStore,
  type LotteryAttemptPrize,
  type LotterySceneDoorState
} from "@/entities/lottery";
import { useLotteryCodeCheckFlow } from "@/features/check-lottery-combination";

import { LotteryPrizeResultModal } from "../lottery-prize-result-modal";
import { LotterySafeResult } from "../lottery-safe-result";

import "./lottery-widget-scene.scss";

type LotteryWidgetSceneProps = {
  onAssetsReady?: () => void;
};

type LotterySafeResultState = {
  outcome: "jackpot";
  prize?: LotteryAttemptPrize;
};

export function LotteryWidgetScene({ onAssetsReady }: LotteryWidgetSceneProps) {
  const { checkCombination, checkError, clearCheckError, isChecking, notifyLoseResult } =
    useLotteryCodeCheckFlow();
  const lockSubmittedCode = useLotteryStore((state) => state.lockCode);
  const [doorState, setDoorState] = useState<LotterySceneDoorState>("idle");
  const [isSemiJackpotModalOpen, setIsSemiJackpotModalOpen] = useState(false);
  const [loseMessage, setLoseMessage] = useState<string | undefined>();
  const [safeResult, setSafeResult] = useState<LotterySafeResultState | null>(null);
  const [semiJackpotPrize, setSemiJackpotPrize] = useState<LotteryAttemptPrize | undefined>();
  const isResultAnimationActive =
    doorState === "jackpotReveal" || doorState === "losePeek" || doorState === "peekTwice";

  const resetResultPresentation = useCallback(() => {
    setDoorState("idle");
    setIsSemiJackpotModalOpen(false);
    setLoseMessage(undefined);
    setSafeResult(null);
    setSemiJackpotPrize(undefined);
  }, []);

  const handleCheck = useCallback(
    async (digits: string[]) => {
      if (isResultAnimationActive) {
        return;
      }

      resetResultPresentation();

      const result = await checkCombination([...digits]);

      if (!result?.attemptSpent) {
        return;
      }

      if (result.outcome === "lose") {
        setLoseMessage(result.message);
        setDoorState("losePeek");
        return;
      }

      if (result.outcome === "jackpot") {
        setSafeResult({ outcome: "jackpot", prize: result.prize });
        setDoorState("jackpotReveal");
        lockSubmittedCode();
        return;
      }

      setSemiJackpotPrize(result.prize);
      setDoorState("peekTwice");
    },
    [checkCombination, isResultAnimationActive, lockSubmittedCode, resetResultPresentation]
  );

  const handleCodeChange = useCallback(() => {
    clearCheckError();
    resetResultPresentation();
  }, [clearCheckError, resetResultPresentation]);

  const handleDoorAnimationEnd = useCallback(
    (nextDoorState: LotterySceneDoorState) => {
      if (nextDoorState === "losePeek") {
        notifyLoseResult(loseMessage);
        setLoseMessage(undefined);
        setDoorState("idle");
        return;
      }

      if (nextDoorState === "peekTwice") {
        setIsSemiJackpotModalOpen(true);
        return;
      }

      if (nextDoorState === "jackpotReveal") {
        setDoorState("jackpotOpen");
      }
    },
    [loseMessage, notifyLoseResult]
  );

  const closeSemiJackpotModal = useCallback(() => {
    setIsSemiJackpotModalOpen(false);
    setDoorState("idle");
    setSemiJackpotPrize(undefined);
  }, []);

  const codePanel = (
    <>
      <LotteryCodePanel
        hideSelectedDigitsFromOtherColumns
        isInteractionDisabled={isResultAnimationActive}
        isChecking={isChecking}
        onCheck={handleCheck}
        onCodeChange={handleCodeChange}
      />

      {checkError ? (
        <p className="lottery-widget-scene__check-error" role="status">
          {checkError}
        </p>
      ) : null}
    </>
  );

  return (
    <>
      <LotteryScene
        codePanel={codePanel}
        doorState={doorState}
        isDoorDisabled={isResultAnimationActive}
        onAssetsReady={onAssetsReady}
        onDoorAnimationEnd={handleDoorAnimationEnd}
        safeContent={
          safeResult?.outcome === "jackpot" ? <LotterySafeResult prize={safeResult.prize} /> : null
        }
      />

      <LotteryPrizeResultModal
        isOpen={isSemiJackpotModalOpen}
        onClose={closeSemiJackpotModal}
        prize={semiJackpotPrize}
      />
    </>
  );
}
