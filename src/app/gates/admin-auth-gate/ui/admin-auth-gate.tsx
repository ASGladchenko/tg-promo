import { Outlet } from "react-router";

import { useMe } from "@/entities/me";

import { NavigateWithLocations } from "./navigate-with-locations";

export function AdminAuthGate() {
  const { data: adminSession, isLoading } = useMe();

  if (isLoading) {
    return null;
  }

  if (adminSession === undefined) {
    return <NavigateWithLocations to="/admin/login" replace state={{ from: location }} />;
  }

  if (!adminSession?.permissions?.includes("admin.access")) {
    return <NavigateWithLocations to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
