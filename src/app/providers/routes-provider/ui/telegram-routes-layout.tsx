import { Outlet } from "react-router";

import { AuthGate, RealtimeGate, TelegramGate } from "@/app/gates";

export function TelegramRoutesLayout() {
  return (
    <TelegramGate>
      <AuthGate>
        <RealtimeGate />
        <Outlet />
      </AuthGate>
    </TelegramGate>
  );
}
