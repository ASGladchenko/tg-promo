import OpenTelegramButton from "@/features/open-telegram-button";
import LotteryPage from "@/pages/lottery-page";
import { PUBLIC_ENV } from "@/shared/config";
import { useIsTelegram } from "@/shared/hooks";
import WidgetHeader from "@/widgets/widget-header";

const MINI_APP_URL = PUBLIC_ENV.TELEGRAM_SHARE_URL;

export default function App() {
  const isTelegram = useIsTelegram();
  const isDevBrowserPreview = import.meta.env.DEV;

  function openMiniAppFromSite() {
    window.open(MINI_APP_URL, "_blank", "noopener,noreferrer");
  }

  if (!isTelegram && !isDevBrowserPreview) {
    return (
      <main className="page">
        <WidgetHeader siteUrl={"/google.com"} />

        <OpenTelegramButton onClick={openMiniAppFromSite} />
      </main>
    );
  }

  return (
    <main className="page">
      <WidgetHeader siteUrl={"/google.com"} />

      <LotteryPage isTelegram={isTelegram} />
    </main>
  );
}
