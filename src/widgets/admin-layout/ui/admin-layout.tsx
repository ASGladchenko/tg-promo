import { Link, Outlet } from "react-router";

import "./admin-layout.scss";

export function AdminLayout() {
  return (
    <main className="admin-layout">
      <aside className="admin-layout__sidebar">
        <nav className="admin-layout__nav" aria-label="Admin navigation" style={{ color: "white" }}>
          Admin nav
        </nav>

        <Link to="/admin">Admin</Link>
        <Link to="/admin/settings">Settings</Link>
      </aside>

      <section className="admin-layout__content">
        <Outlet />
      </section>
    </main>
  );
}
