import { type ReactNode, useEffect } from "react";

import { miniApp, retrieveLaunchParams, retrieveRawInitData, viewport } from "@tma.js/sdk-react";

import { OpenTelegramButton } from "@/features/open-telegram-button";
import { PUBLIC_ENV } from "@/shared/config";
import {
  applyLocale,
  getBrowserLanguages,
  resolveBrowserLocale,
  resolveTelegramLocale
} from "@/shared/lib/i18n";
import { ensureTelegramSdkInitialized, useTelegramRuntimeStore } from "@/shared/lib/telegram";

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
    let isCancelled = false;

    async function setBrowserRuntimeWithLocale() {
      await applyLocale(resolveBrowserLocale(getBrowserLanguages()));

      if (!isCancelled) {
        setBrowserRuntime();
      }
    }

    async function initializeRuntime() {
      if (!ensureTelegramSdkInitialized()) {
        await setBrowserRuntimeWithLocale();
        return;
      }

      let rawInitData: string | undefined;

      try {
        rawInitData = retrieveRawInitData();
      } catch {
        await setBrowserRuntimeWithLocale();
        return;
      }

      if (!rawInitData) {
        await setBrowserRuntimeWithLocale();
        return;
      }

      let languageCode: string | undefined;

      try {
        languageCode = retrieveLaunchParams().tgWebAppData?.user?.language_code;
      } catch {
        languageCode = undefined;
      }

      await applyLocale(resolveTelegramLocale(languageCode));

      if (isCancelled) {
        return;
      }

      setTelegramRuntime(rawInitData);

      try {
        if (miniApp.mount.isAvailable()) {
          miniApp.mount();
        }
      } catch {
        // Optional SDK mounting must not change the detected runtime.
      }

      try {
        if (miniApp.ready.isAvailable()) {
          miniApp.ready();
        }
      } catch {
        // Telegram runtime has already been established.
      }

      if (viewport.mount.isAvailable()) {
        void viewport.mount().catch(() => undefined);
      }

      try {
        if (viewport.expand.isAvailable()) {
          viewport.expand();
        }
      } catch {
        // Expansion is optional and must not change the detected runtime.
      }
    }

    void initializeRuntime();

    return () => {
      isCancelled = true;
    };
  }, [setBrowserRuntime, setTelegramRuntime]);

  function openMiniAppFromSite() {
    window.open(MINI_APP_URL, "_blank", "noopener,noreferrer");
  }

  if (status === "browser" && !isDevBrowserPreview) {
    return <OpenTelegramButton onClick={openMiniAppFromSite} />;
  }

  return <>{children}</>;
}
