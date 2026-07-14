import { useState } from "react";

import clsx from "clsx";
import { NavLink, useLocation } from "react-router";

import ChevronDownIcon from "@/shared/svg/chevron-down.svg?react";

import { type AdminSidebarGroupItem as AdminSidebarGroupItemConfig } from "./admin-sidebar-items";

type AdminSidebarGroupItemProps = {
  item: AdminSidebarGroupItemConfig;
};

export function AdminSidebarGroupItem({ item }: AdminSidebarGroupItemProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = location.pathname === item.basePath || location.pathname.startsWith(`${item.basePath}/`);

  return (
    <div className="admin-sidebar__group">
      <button
        type="button"
        className={clsx("admin-sidebar__link admin-sidebar__group-trigger", {
          "admin-sidebar__link--active": isActive,
          "admin-sidebar__group-trigger--open": isOpen
        })}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="admin-sidebar__link-label">{item.title}</span>
        <ChevronDownIcon className="admin-sidebar__group-indicator" aria-hidden="true" focusable="false" />
      </button>

      {isOpen ? (
        <div className="admin-sidebar__subnav">
          {item.children.map(({ title, to, end }) => (
            <NavLink
              to={to}
              end={end}
              key={title}
              className={({ isActive: isChildActive }) =>
                clsx("admin-sidebar__link admin-sidebar__sublink", {
                  "admin-sidebar__link--active": isChildActive
                })
              }
            >
              <span className="admin-sidebar__link-label">{title}</span>
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}
