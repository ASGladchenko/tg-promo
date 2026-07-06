import { Outlet } from "react-router";

import { AdminHeader } from "@/widgets/admin-header";
import { AdminSidebar } from "@/widgets/admin-sidebar";

import "./admin-layout.scss";

export function AdminLayout() {
  return (
    <section className="admin-layout" aria-label="Admin layout">
      <AdminSidebar />
      <AdminHeader />

      <main className="admin-layout__main" role="main">
        <Outlet />
      </main>
    </section>
  );
}
