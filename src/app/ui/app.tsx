import { AuthGate, TelegramGate } from "@/app/gates";
import { LotteryPage } from "@/pages/lottery-page";
import { WidgetHeader } from "@/widgets/widget-header";

import "./app.scss";

export function App() {
  return (
    <main className="page">
      <TelegramGate>
        <AuthGate>
          <WidgetHeader siteUrl={"/google.com"} />

          <LotteryPage />
        </AuthGate>
      </TelegramGate>
    </main>
  );
}
