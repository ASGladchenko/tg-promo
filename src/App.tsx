import { AuthGate, TelegramGate } from "@/app/gates";
import LotteryPage from "@/pages/lottery-page";
import WidgetHeader from "@/widgets/widget-header";

export default function App() {
  return (
    <main className="page">
      <TelegramGate>
        {({ initData, isTelegram, isTelegramReady }) => (
          <AuthGate initData={initData} isTelegram={isTelegram} isTelegramReady={isTelegramReady}>
            <>
              <WidgetHeader siteUrl={"/google.com"} />

              <LotteryPage />
            </>
          </AuthGate>
        )}
      </TelegramGate>
    </main>
  );
}
