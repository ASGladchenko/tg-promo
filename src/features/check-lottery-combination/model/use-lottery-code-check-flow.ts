import { useCallback, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { setAttemptsWalletQueryData } from "@/entities/attempts";
import { checkLotteryCombination, type LotteryAttemptResult } from "@/entities/lottery";
import { triggerErrorHapticFeedback, triggerRigidHapticFeedback } from "@/shared/lib/telegram";
import { notify } from "@/shared/lib/toast";

const DEFAULT_LOSE_MESSAGES = new Set(["No luck this time", "No luck this time."]);
const DUPLICATE_SEMI_JACKPOT_LOSE_MESSAGE = "Jackpot was not won. Semipot is active";
const DUPLICATE_SEMI_JACKPOT_LOSE_MESSAGES = new Set([
  DUPLICATE_SEMI_JACKPOT_LOSE_MESSAGE,
  `${DUPLICATE_SEMI_JACKPOT_LOSE_MESSAGE}.`
]);

function getNormalizedMessage(message?: string): string | null {
  const normalizedMessage = message?.trim();

  return normalizedMessage ? normalizedMessage : null;
}

export function useLotteryCodeCheckFlow() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const isCheckingRef = useRef(false);

  const notifyAttemptResult = useCallback(
    (result: LotteryAttemptResult) => {
      if (!result.attemptSpent) {
        notify.warning(t(`lottery.results.${result.reason}`));
        triggerErrorHapticFeedback();
        return;
      }

      setAttemptsWalletQueryData(queryClient, result.wallet);
      triggerRigidHapticFeedback();
    },
    [queryClient, t]
  );

  const notifyLoseResult = useCallback((message?: string) => {
    const normalizedMessage = getNormalizedMessage(message);

    if (!normalizedMessage || DEFAULT_LOSE_MESSAGES.has(normalizedMessage)) {
      notify.info(t("lottery.results.lose"));
      return;
    }

    if (DUPLICATE_SEMI_JACKPOT_LOSE_MESSAGES.has(normalizedMessage)) {
      notify.info(t("lottery.results.duplicateSemiJackpotLose"));
      return;
    }

    notify.info(normalizedMessage);
  }, [t]);

  const checkCombination = useCallback(
    async (digits: string[]): Promise<LotteryAttemptResult | null> => {
      if (isCheckingRef.current) {
        return null;
      }

      isCheckingRef.current = true;
      setIsChecking(true);
      setCheckError(null);

      try {
        const result = await checkLotteryCombination(digits);
        notifyAttemptResult(result);
        return result;
      } catch {
        const errorMessage = t("lottery.errors.checkCombination");
        setCheckError(errorMessage);
        notify.error(errorMessage);
        triggerErrorHapticFeedback();
        return null;
      } finally {
        isCheckingRef.current = false;
        setIsChecking(false);
      }
    },
    [notifyAttemptResult, t]
  );

  const clearCheckError = useCallback(() => {
    setCheckError(null);
  }, []);

  return {
    checkCombination,
    checkError,
    clearCheckError,
    notifyLoseResult,
    isChecking
  };
}
