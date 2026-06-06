import { useCallback, useRef, useState } from "react";
import { checkLotteryCombination } from "@/entities/lottery";
import {
  triggerErrorHapticFeedback,
  triggerRigidHapticFeedback,
} from "@/shared/lib/telegram";

const CHECK_ERROR_MESSAGE = "Не удалось проверить комбинацию. Попробуйте еще раз.";

export function useLotteryCodeCheckFlow() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const isCheckingRef = useRef(false);

  const checkCombination = useCallback(async (digits: string[]) => {
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
      setCheckError(CHECK_ERROR_MESSAGE);
      triggerErrorHapticFeedback();
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
    }
  }, []);

  const clearCheckError = useCallback(() => {
    setCheckError(null);
  }, []);

  return {
    checkCombination,
    checkError,
    clearCheckError,
    isChecking,
  };
}
