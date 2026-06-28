import { Navigate, Outlet, useLocation } from "react-router";

import { useMe } from "@/entities/me";

export function AdminAuthGate() {
  const location = useLocation();
  const { data: adminSession, isLoading } = useMe();

  if (isLoading) {
    return null;
  }

  if (!adminSession) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
