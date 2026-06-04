import { miniApp, retrieveRawInitData, viewport } from "@tma.js/sdk-react";
import { type ReactNode, useEffect, useState } from "react";
import OpenTelegramButton from "@/features/open-telegram-button";
import { PUBLIC_ENV } from "@/shared/config";
import { ensureTelegramSdkInitialized } from "@/shared/hooks";

type TelegramGateRenderProps = {
  initData?: string;
  isTelegram: boolean;
  isTelegramReady: boolean;
};

type TelegramGateProps = {
  children: (props: TelegramGateRenderProps) => ReactNode;
};

const MINI_APP_URL = PUBLIC_ENV.TELEGRAM_SHARE_URL;

export default function TelegramGate({ children }: TelegramGateProps) {
  const [initData, setInitData] = useState<string | undefined>();
  const [isTelegram, setIsTelegram] = useState(false);
  const [isTelegramReady, setIsTelegramReady] = useState(false);
  const isDevBrowserPreview = false;

  useEffect(() => {
    if (!ensureTelegramSdkInitialized()) {
      setIsTelegram(false);
      setIsTelegramReady(true);
      return;
    }

    try {
      const rawInitData = retrieveRawInitData();

      if (!rawInitData) {
        setIsTelegram(false);
        setIsTelegramReady(true);
        return;
      }

      setInitData(rawInitData);
      setIsTelegram(true);

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
      setIsTelegram(false);
    } finally {
      setIsTelegramReady(true);
    }
  }, []);

  function openMiniAppFromSite() {
    window.open(MINI_APP_URL, "_blank", "noopener,noreferrer");
  }

  if (isTelegramReady && !isTelegram && !isDevBrowserPreview) {
    return <OpenTelegramButton onClick={openMiniAppFromSite} />;
  }

  return <>{children({ initData, isTelegram, isTelegramReady })}</>;
}
