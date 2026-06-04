import { init, isTMA } from "@tma.js/sdk-react";
import { useEffect, useState } from "react";

let sdkInitState: "idle" | "ready" | "failed" = "idle";

export function ensureTelegramSdkInitialized(): boolean {
  if (sdkInitState === "ready") {
    return true;
  }

  if (sdkInitState === "failed") {
    return false;
  }

  try {
    init();
    sdkInitState = "ready";
    return true;
  } catch {
    sdkInitState = "failed";
    return false;
  }
}

export function useIsTelegram(): boolean {
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    if (!ensureTelegramSdkInitialized()) {
      setIsTelegram(false);
      return;
    }

    try {
      setIsTelegram(isTMA());
    } catch {
      setIsTelegram(false);
    }
  }, []);

  return isTelegram;
}
