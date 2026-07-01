import { Outlet } from "react-router";

import "./admin-layout.scss";

export function AdminLayout() {
  return (
    <section className="admin-layout" aria-label="Admin layout">
      <aside className="admin-layout__aside">
        <div>Logo</div>
        <div>Set prize</div>
        <div>Set rules</div>
      </aside>

      <header className="admin-layout__header">
        <div>header</div>
      </header>

      <main className="admin-layout__main" role="main">
        <Outlet />
      </main>
    </section>
  );
}
