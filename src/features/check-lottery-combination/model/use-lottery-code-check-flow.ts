import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { checkLotteryCombination } from "@/entities/lottery";
import { triggerErrorHapticFeedback, triggerRigidHapticFeedback } from "@/shared/lib/telegram";

export function useLotteryCodeCheckFlow() {
  const { t } = useTranslation();
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const isCheckingRef = useRef(false);

  const checkCombination = useCallback(
    async (digits: string[]) => {
      if (isCheckingRef.current) {
        return;
      }

      isCheckingRef.current = true;
      setIsChecking(true);
      setCheckError(null);

      try {
        await checkLotteryCombination(digits);
        triggerRigidHapticFeedback();
      } catch {
        setCheckError(t("lottery.errors.checkCombination"));
        triggerErrorHapticFeedback();
      } finally {
        isCheckingRef.current = false;
        setIsChecking(false);
      }
    },
    [t]
  );

  const clearCheckError = useCallback(() => {
    setCheckError(null);
  }, []);

  return {
    checkCombination,
    checkError,
    clearCheckError,
    isChecking
  };
}
