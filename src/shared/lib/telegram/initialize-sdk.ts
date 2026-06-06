import { init } from "@tma.js/sdk-react";

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
