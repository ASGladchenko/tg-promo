import { Route, Routes } from "react-router";

import { AdminAuthGate } from "@/app/gates";
import { AdminPage } from "@/pages/admin-page";
import { LotteryPage } from "@/pages/lottery-page";
import { AdminLayout } from "@/widgets/admin-layout";

import { TelegramRoutesLayout } from "./telegram-routes-layout";
import { AdminCssLayout } from "./wrapper-admin";

export function ProviderRoutes() {
  return (
    <Routes>
      <Route element={<TelegramRoutesLayout />}>
        <Route path="/" element={<LotteryPage />} />
      </Route>

      <Route element={<AdminCssLayout />}>
        <Route path="/admin/login" element={<AdminPage />} />

        <Route element={<AdminAuthGate />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPage />} />
            <Route path="settings" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<div style={{ color: "white" }}>404</div>} />
    </Routes>
  );
}
