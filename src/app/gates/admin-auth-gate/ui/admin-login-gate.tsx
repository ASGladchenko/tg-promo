import { Navigate, Outlet } from "react-router";

import { useMe } from "@/entities/me";

import { canAccessAdminRoutes } from "../lib/can-access-admin-routes";
import { NavigateWithLocations } from "./navigate-with-locations";

export function AdminLoginGate() {
  const { data: adminSession, isLoading } = useMe();

  if (isLoading) {
    return null;
  }

  if (adminSession === undefined) {
    return <Outlet />;
  }

  if (canAccessAdminRoutes(adminSession.permissions)) {
    return <NavigateWithLocations to="/admin" replace />;
  }

  return <Navigate to="/" replace />;
}
