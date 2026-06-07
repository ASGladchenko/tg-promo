import { AuthGate, TelegramGate } from "@/app/gates";
import { LotteryPage } from "@/pages/lottery-page";
import { AttemptsWalletWidget } from "@/widgets/attempts-wallet-widget";
import { WidgetHeader } from "@/widgets/widget-header";

import "./app.scss";

export function App() {
  return (
    <main className="page">
      <TelegramGate>
        <AuthGate>
          <WidgetHeader siteUrl={"/google.com"} />
          <AttemptsWalletWidget />

          <LotteryPage />
        </AuthGate>
      </TelegramGate>
    </main>
  );
}
