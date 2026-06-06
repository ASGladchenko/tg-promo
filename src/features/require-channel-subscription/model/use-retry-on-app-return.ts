import { useEffect } from "react";

type UseRetryOnAppReturnOptions = {
  enabled: boolean;
  onReturn: () => void;
};

export function useRetryOnAppReturn({ enabled, onReturn }: UseRetryOnAppReturnOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleReturn() {
      if (document.visibilityState === "visible") {
        onReturn();
      }
    }

    window.addEventListener("focus", handleReturn);
    document.addEventListener("visibilitychange", handleReturn);

    return () => {
      window.removeEventListener("focus", handleReturn);
      document.removeEventListener("visibilitychange", handleReturn);
    };
  }, [enabled, onReturn]);
}
