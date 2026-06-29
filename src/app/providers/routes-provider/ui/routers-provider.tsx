import { Suspense } from "react";

import { Route, Routes } from "react-router";

import { LotteryPage } from "@/pages/lottery-page";

import {
  LazyAdminAuthGate,
  LazyAdminCssLayout,
  LazyAdminLayout,
  LazyAdminLoginGate,
  LazyAdminLogin,
  LazyAdminPage
} from "./lazy-routes";
import { TelegramRoutesLayout } from "./telegram-routes-layout";

export function ProviderRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<TelegramRoutesLayout />}>
          <Route path="/" element={<LotteryPage />} />
        </Route>

        <Route element={<LazyAdminCssLayout />}>
          <Route element={<LazyAdminLoginGate />}>
            <Route path="/admin/login" element={<LazyAdminLogin />} />
          </Route>

          <Route element={<LazyAdminAuthGate />}>
            <Route path="/admin" element={<LazyAdminLayout />}>
              <Route index element={<LazyAdminPage />} />
              <Route path="settings" element={<LazyAdminPage />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <div
              style={{
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "50px",
                height: "100vh"
              }}
            >
              404
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
