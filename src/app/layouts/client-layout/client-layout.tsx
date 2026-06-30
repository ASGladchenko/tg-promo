import { Outlet } from "react-router";

import { AttemptsWalletWidget } from "@/widgets/attempts-wallet-widget";
import { WidgetHeader } from "@/widgets/widget-header";

import "./client-layout.scss";

export function ClientLayout() {
  return (
    <main className="client_layout">
      <WidgetHeader siteUrl="/google.com" />
      <AttemptsWalletWidget />

      <div className="client_layout-content">
        <Outlet />
      </div>
    </main>
  );
}
