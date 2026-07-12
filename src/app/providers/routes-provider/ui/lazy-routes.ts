import { lazy } from "react";

export const LazyAdminAuthGate = lazy(() =>
  import("@/app/gates").then(({ AdminAuthGate }) => ({ default: AdminAuthGate }))
);

export const LazyAdminLoginGate = lazy(() =>
  import("@/app/gates").then(({ AdminLoginGate }) => ({ default: AdminLoginGate }))
);

export const LazyAdminPage = lazy(() =>
  import("@/pages/admin-page").then(({ AdminPage }) => ({ default: AdminPage }))
);

export const LazyAdminLayout = lazy(() =>
  import("@/app/layouts").then(({ AdminLayout }) => ({ default: AdminLayout }))
);

export const LazyAdminCssLayout = lazy(() =>
  import("./admin-css-layout").then(({ AdminCssLayout }) => ({ default: AdminCssLayout }))
);

export const LazyAdminLogin = lazy(() =>
  import("@/pages/admin-login").then(({ AdminLogin }) => ({ default: AdminLogin }))
);

export const LazyAdminPrizes = lazy(() =>
  import("@/pages/admin-prizes").then(({ AdminPrizes }) => ({ default: AdminPrizes }))
);

export const LazyAdminRules = lazy(() =>
  import("@/pages/admin-rules").then(({ AdminRules }) => ({ default: AdminRules }))
);

export const LazyAdminConsolationPrizes = lazy(() =>
  import("@/pages/admin-consolation-prizes").then(({ AdminConsolationPrizes }) => ({
    default: AdminConsolationPrizes
  }))
);
