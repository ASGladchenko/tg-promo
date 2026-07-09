import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  type LotteryAttemptPrize,
  LotteryCodePanel,
  LotteryScene,
  type LotterySceneDoorState,
  useLotteryStore
} from "@/entities/lottery";
import { useLotteryCodeCheckFlow } from "@/features/check-lottery-combination";

import { LotteryDuplicateCodeModal } from "../lottery-duplicate-code-modal";
import { LotteryEnteredCodesModal } from "../lottery-entered-codes-modal";
import { LotteryPrizeResultModal } from "../lottery-prize-result-modal";
import { LotterySafeResult } from "../lottery-safe-result";
import { useReadyTimer } from "./use-ready-timer";

import "./lottery-widget-scene.scss";

type LotteryWidgetSceneProps = {
  enteredCodes: string[];
  initialPrize: LotteryAttemptPrize | undefined;
  onAssetsReady?: () => void;
};
type LotterySafeResultState = {
  outcome: "jackpot";
  prize?: LotteryAttemptPrize;
};

export function LotteryWidgetScene({ enteredCodes, onAssetsReady, initialPrize }: LotteryWidgetSceneProps) {
  const { t } = useTranslation();
  const {
    checkCombination,
    checkError,
    clearCheckError,
    ensureAttemptsAvailable,
    isChecking,
    notifyLoseResult
  } = useLotteryCodeCheckFlow();
  const lockSubmittedCode = useLotteryStore((state) => state.lockCode);
  const [doorState, setDoorState] = useState<LotterySceneDoorState>("idle");
  const [duplicateCodeDigits, setDuplicateCodeDigits] = useState<string[] | null>(null);
  const [isEnteredCodesModalOpen, setIsEnteredCodesModalOpen] = useState(false);
  const [isSemiJackpotModalOpen, setIsSemiJackpotModalOpen] = useState(false);
  const [loseMessage, setLoseMessage] = useState<string | undefined>();

  const [safeResult, setSafeResult] = useState<LotterySafeResultState | null>(null);

  const [semiJackpotPrize, setSemiJackpotPrize] = useState<LotteryAttemptPrize | undefined>();
  const isResultAnimationActive =
    doorState === "jackpotReveal" || doorState === "losePeek" || doorState === "peekTwice";
  const isInitialJackpotWon = Boolean(initialPrize);
  const { isReady, startReadyTimer } = useReadyTimer();
  const isInteractionLocked = isResultAnimationActive || isInitialJackpotWon;
  const isDuplicateCodeModalOpen = duplicateCodeDigits !== null;
  const isCodeInteractionDisabled =
    isInteractionLocked || isDuplicateCodeModalOpen || isEnteredCodesModalOpen;

  const resetResultPresentation = useCallback(() => {
    setDoorState("idle");
    setIsSemiJackpotModalOpen(false);
    setLoseMessage(undefined);
    setSafeResult(null);
    setSemiJackpotPrize(undefined);
  }, []);

  const checkCode = useCallback(
    async (digits: string[]) => {
      if (isInteractionLocked) {
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
        startReadyTimer(800);
        lockSubmittedCode();
        return;
      }

      setSemiJackpotPrize(result.prize);
      setDoorState("peekTwice");
    },
    [checkCombination, isInteractionLocked, lockSubmittedCode, resetResultPresentation, startReadyTimer]
  );

  const handleCheck = useCallback(
    (digits: string[]) => {
      if (isCodeInteractionDisabled) {
        return;
      }

      if (!ensureAttemptsAvailable()) {
        return;
      }

      const submittedDigits = [...digits];
      const submittedCode = submittedDigits.join("");

      if (enteredCodes.includes(submittedCode)) {
        clearCheckError();
        setDuplicateCodeDigits(submittedDigits);
        return;
      }

      void checkCode(submittedDigits);
    },
    [checkCode, clearCheckError, ensureAttemptsAvailable, enteredCodes, isCodeInteractionDisabled]
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
        startReadyTimer(800);
      }
    },
    [loseMessage, notifyLoseResult, startReadyTimer]
  );

  useEffect(() => {
    if (!initialPrize) {
      return;
    }

    setSafeResult({
      outcome: "jackpot",
      prize: initialPrize
    });

    setDoorState("jackpotOpen");
    startReadyTimer(800);
  }, [initialPrize, startReadyTimer]);

  const closeSemiJackpotModal = useCallback(() => {
    setIsSemiJackpotModalOpen(false);
    setDoorState("idle");
    setSemiJackpotPrize(undefined);
  }, []);

  const cancelDuplicateCode = useCallback(() => {
    setDuplicateCodeDigits(null);
  }, []);

  const confirmDuplicateCode = useCallback(() => {
    if (!duplicateCodeDigits) {
      return;
    }

    const submittedDigits = [...duplicateCodeDigits];
    setDuplicateCodeDigits(null);
    void checkCode(submittedDigits);
  }, [checkCode, duplicateCodeDigits]);

  const openEnteredCodesModal = useCallback(() => {
    setIsEnteredCodesModalOpen(true);
  }, []);

  const closeEnteredCodesModal = useCallback(() => {
    setIsEnteredCodesModalOpen(false);
  }, []);

  const codePanel = (
    <>
      <LotteryCodePanel
        hideSelectedDigitsFromOtherColumns
        isInteractionDisabled={isCodeInteractionDisabled}
        isChecking={isChecking}
        onCheck={handleCheck}
        onCodeChange={handleCodeChange}
      />

      {enteredCodes.length > 0 ? (
        <button
          className="lottery-widget-scene__entered-codes-trigger"
          type="button"
          disabled={isCodeInteractionDisabled || isChecking}
          onClick={openEnteredCodesModal}
        >
          {t("lottery.enteredCodesTrigger", { count: enteredCodes.length })}
        </button>
      ) : null}

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
        isDoorOpen={isReady}
        isDoorDisabled={isCodeInteractionDisabled}
        onAssetsReady={onAssetsReady}
        onDoorAnimationEnd={handleDoorAnimationEnd}
        safeContent={
          safeResult?.outcome === "jackpot" ? <LotterySafeResult prize={safeResult.prize} /> : null
        }
      />

      <LotteryDuplicateCodeModal
        code={duplicateCodeDigits?.join("") ?? ""}
        isOpen={isDuplicateCodeModalOpen}
        onCancel={cancelDuplicateCode}
        onConfirm={confirmDuplicateCode}
      />

      <LotteryEnteredCodesModal
        codes={enteredCodes}
        isOpen={isEnteredCodesModalOpen}
        onClose={closeEnteredCodesModal}
      />

      <LotteryPrizeResultModal
        isOpen={isSemiJackpotModalOpen}
        onClose={closeSemiJackpotModal}
        prize={semiJackpotPrize}
      />
    </>
  );
}
