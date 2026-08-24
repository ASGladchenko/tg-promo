import { Outlet } from "react-router";

import { LuckyMeadowAwardModal } from "@/entities/lucky-meadow";
import { AwardedUserPrizeModal } from "@/entities/prizes";
import { MyPrizesTrigger } from "@/features/view-my-prizes";
import { AttemptsWalletWidget } from "@/widgets/attempts-wallet-widget";
import { WidgetHeader } from "@/widgets/widget-header";

import "./client-layout.scss";

export function ClientLayout() {
  return (
    <main className="client_layout">
      <WidgetHeader siteUrl="https://1mlnbet.com" />
      <div className="client_layout--subhead">
        <AttemptsWalletWidget />
        <MyPrizesTrigger className="client_layout-prize-button" />
      </div>

      <div className="client_layout-content">
        <Outlet />
      </div>

      <AwardedUserPrizeModal />
      <LuckyMeadowAwardModal />
    </main>
  );
}
