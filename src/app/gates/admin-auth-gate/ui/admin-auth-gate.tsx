import { Outlet } from "react-router";

import { useMe } from "@/entities/me";
import { APP_ROUTES } from "@/shared/config";

import { canAccessAdminRoutes } from "../lib/can-access-admin-routes";
import { NavigateWithLocations } from "./navigate-with-locations";

export function AdminAuthGate() {
  const { data: adminSession, isLoading } = useMe();

  if (isLoading) {
    return null;
  }

  if (adminSession === undefined) {
    return <NavigateWithLocations to={APP_ROUTES.adminLogin} replace />;
  }

  if (!canAccessAdminRoutes(adminSession.permissions)) {
    return <NavigateWithLocations to={APP_ROUTES.home} replace />;
  }

  return <Outlet />;
}
