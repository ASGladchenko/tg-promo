import { init, isTMA, miniApp, retrieveLaunchParams, viewport } from "@tma.js/sdk-react";
import { useEffect, useState } from "react";
import { LotteryScene } from "@/entities/lottery";
import { PUBLIC_ENV } from "@/shared/config/public-env";
import WidgetHeader from "@/widgets/widget-header";

type TelegramUser = {
  first_name?: string;
  username?: string;
};

let sdkInitState: "idle" | "ready" | "failed" = "idle";
const MINI_APP_URL = PUBLIC_ENV.TELEGRAM_SHARE_URL;
const BRAND_SITE_URL = PUBLIC_ENV.BRAND_SITE_URL;

function ensureSdkInitialized(): boolean {
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

export default function App() {
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUserLabel, setTelegramUserLabel] = useState("guest");

  useEffect(() => {
    if (!ensureSdkInitialized()) {
      return;
    }

    if (!isTMA()) {
      return;
    }

    setIsTelegram(true);

    try {
      const launchParams = retrieveLaunchParams();
      const user = launchParams.tgWebAppData?.user as TelegramUser | undefined;
      if (user?.username) {
        setTelegramUserLabel(`@${user.username}`);
      } else if (user?.first_name) {
        setTelegramUserLabel(user.first_name);
      }
    } catch {
      setTelegramUserLabel("guest");
    }

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
  }, []);

  function openMiniAppFromSite() {
    window.open(MINI_APP_URL, "_blank", "noopener,noreferrer");
  }

  const isDevBrowserPreview = import.meta.env.DEV && !isTelegram;

  if (!isTelegram && !isDevBrowserPreview) {
    return (
      <main className="page--only-button">
        <button className="page__cta-button" type="button" onClick={openMiniAppFromSite}>
          Открыть в Telegram
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <WidgetHeader siteUrl={BRAND_SITE_URL} />
      <section className="page__body">
        <LotteryScene />
        <p className="page__meta">
          mode: {isTelegram ? `telegram (${telegramUserLabel})` : "dev browser preview"}
        </p>
      </section>
    </main>
  );
}
