import { AdminProfileMenu } from "./admin-profile-menu";

import "./admin-header.scss";

export function AdminHeader() {
  return (
    <header className="admin-header">
      <AdminProfileMenu />
    </header>
  );
}
