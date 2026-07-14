import { Suspense } from "react";

import { Route, Routes } from "react-router";

import { ClientLayout } from "@/app/layouts";
import { LotteryPage } from "@/pages/lottery-page";
import { APP_ROUTES } from "@/shared/config";

import {
  LazyAdminAuthGate,
  LazyAdminCssLayout,
  LazyAdminConsolationPrizes,
  LazyAdminLayout,
  LazyAdminLogin,
  LazyAdminLoginGate,
  LazyAdminPage,
  LazyAdminPrizes,
  LazyAdminRules
} from "./lazy-routes";
import { TelegramRoutesLayout } from "./telegram-routes-layout";

export function ProviderRoutes() {
  return (
    <Routes>
      <Route element={<TelegramRoutesLayout />}>
        <Route element={<ClientLayout />}>
          <Route path={APP_ROUTES.home} element={<LotteryPage />} />
        </Route>
      </Route>

      <Route
        element={
          <Suspense fallback="Loading...">
            <LazyAdminCssLayout />
          </Suspense>
        }
      >
        <Route element={<LazyAdminLoginGate />}>
          <Route path={APP_ROUTES.adminLogin} element={<LazyAdminLogin />} />
        </Route>

        <Route element={<LazyAdminAuthGate />}>
          <Route path={APP_ROUTES.admin} element={<LazyAdminLayout />}>
            <Route index element={<LazyAdminPage />} />
            <Route path={APP_ROUTES.adminPrizes} element={<LazyAdminPrizes />} />
            <Route path={APP_ROUTES.adminRules} element={<LazyAdminRules />} />
            <Route path={APP_ROUTES.adminConsolation} element={<LazyAdminConsolationPrizes />} />
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
              height: "100vh",
              fontSize: "50px",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            404
          </div>
        }
      />
    </Routes>
  );
}
