import clsx from "clsx";
import { NavLink } from "react-router";

import { APP_ROUTES } from "@/shared/config";

import { adminSidebarItems } from "./admin-sidebar-items";
import { AdminSidebarGroupItem } from "./admin-sidebar-group-item";

import "./admin-sidebar.scss";

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar admin-hover-scrollbar-container">
      <NavLink className="admin-sidebar__brand" to={APP_ROUTES.admin}>
        Logo
      </NavLink>

      <nav className="admin-sidebar__nav admin-hover-scrollbar" aria-label="Admin navigation">
        {adminSidebarItems.map((item) => {
          if ("children" in item) {
            return <AdminSidebarGroupItem item={item} key={item.title} />;
          }

          return (
            <NavLink
              to={item.to}
              end={item.end}
              key={item.title}
              className={({ isActive }) =>
                clsx("admin-sidebar__link", {
                  "admin-sidebar__link--active": isActive
                })
              }
            >
              <span className="admin-sidebar__link-label">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
