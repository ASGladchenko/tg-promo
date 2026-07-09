import { useCallback, useEffect, useRef, useState } from "react";

export function useReadyTimer() {
  const timeoutIdRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const clearReadyTimer = useCallback(() => {
    if (timeoutIdRef.current === null) {
      return;
    }

    window.clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = null;
  }, []);

  const startReadyTimer = useCallback(
    (durationMs: number) => {
      clearReadyTimer();
      setIsReady(false);

      if (durationMs <= 0) {
        setIsReady(true);
        return;
      }

      timeoutIdRef.current = window.setTimeout(() => {
        timeoutIdRef.current = null;
        setIsReady(true);
      }, durationMs);
    },
    [clearReadyTimer]
  );

  useEffect(() => clearReadyTimer, [clearReadyTimer]);

  return {
    isReady,
    startReadyTimer
  };
}
