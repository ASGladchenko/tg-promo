import { Outlet } from "react-router";

import "./admin-css-layout.scss";

export function AdminCssLayout() {
  return (
    <div className="admin-css-layout">
      <Outlet />
    </div>
  );
}
