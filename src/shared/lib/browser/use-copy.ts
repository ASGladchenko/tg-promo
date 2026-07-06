import { useCallback, useEffect, useState } from "react";

const COPIED_STATE_DURATION_MS = 300;

export function useCopy(text: string) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setIsCopied(false), COPIED_STATE_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  const onCopy = useCallback(() => {
    void navigator.clipboard?.writeText(text);
    setIsCopied(true);
  }, [text]);

  return {
    onCopy,
    isCopied
  };
}
