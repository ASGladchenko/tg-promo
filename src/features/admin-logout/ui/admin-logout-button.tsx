import { useAdminLogout } from "../model/use-admin-logout";

import "./admin-logout-button.scss";

export function AdminLogoutButton() {
  const adminLogout = useAdminLogout();

  function handleLogout() {
    adminLogout.mutate();
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleLogout}
      className="admin-logout-button"
      disabled={adminLogout.isPending}
    >
      <span>Logout</span>
    </button>
  );
}
