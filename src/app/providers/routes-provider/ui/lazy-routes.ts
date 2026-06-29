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
  import("@/widgets/admin-layout").then(({ AdminLayout }) => ({ default: AdminLayout }))
);

export const LazyAdminCssLayout = lazy(() =>
  import("./admin-css-layout").then(({ AdminCssLayout }) => ({ default: AdminCssLayout }))
);

export const LazyAdminLogin = lazy(() =>
  import("@/pages/admin-login").then(({ AdminLogin }) => ({ default: AdminLogin }))
);
