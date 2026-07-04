import { Outlet } from "react-router";

import "./admin-css-layout.scss";

export function AdminCssLayout() {
  return (
    <div className="admin-css-layout bg-theme">
      <Outlet />
    </div>
  );
}
