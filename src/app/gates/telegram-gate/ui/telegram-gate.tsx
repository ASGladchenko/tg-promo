import { miniApp, retrieveRawInitData, viewport } from "@tma.js/sdk-react";
import { type ReactNode, useEffect } from "react";
import { OpenTelegramButton } from "@/features/open-telegram-button";
import { PUBLIC_ENV } from "@/shared/config";
import {
  ensureTelegramSdkInitialized,
  useTelegramRuntimeStore,
} from "@/shared/lib/telegram";

type TelegramGateProps = {
  children: ReactNode;
};

const MINI_APP_URL = PUBLIC_ENV.TELEGRAM_SHARE_URL;

export function TelegramGate({ children }: TelegramGateProps) {
  const status = useTelegramRuntimeStore((state) => state.status);
  const setBrowserRuntime = useTelegramRuntimeStore((state) => state.setBrowserRuntime);
  const setTelegramRuntime = useTelegramRuntimeStore((state) => state.setTelegramRuntime);
  const isDevBrowserPreview = import.meta.env.DEV;

  useEffect(() => {
    if (!ensureTelegramSdkInitialized()) {
      setBrowserRuntime();
      return;
    }

    try {
      const rawInitData = retrieveRawInitData();

      if (!rawInitData) {
        setBrowserRuntime();
        return;
      }

      setTelegramRuntime(rawInitData);

      if (miniApp.mount.isAvailable()) {
        miniApp.mount();
      }

      if (miniApp.ready.isAvailable()) {
        miniApp.ready();
      }

      if (viewport.mount.isAvailable()) {
        void viewport.mount().catch(() => undefined);
      }

      if (viewport.expand.isAvailable()) {
        viewport.expand();
      }
    } catch {
      setBrowserRuntime();
    }
  }, [setBrowserRuntime, setTelegramRuntime]);

  function openMiniAppFromSite() {
    window.open(MINI_APP_URL, "_blank", "noopener,noreferrer");
  }

  if (status === "browser" && !isDevBrowserPreview) {
    return <OpenTelegramButton onClick={openMiniAppFromSite} />;
  }

  return <>{children}</>;
}
