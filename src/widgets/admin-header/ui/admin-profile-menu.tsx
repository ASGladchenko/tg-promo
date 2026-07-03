import { useId, useRef, useState } from "react";

import clsx from "clsx";

import { useMe } from "@/entities/me";
import { useOutsideClick } from "@/shared/lib/browser";

import { getAdminProfileLabel } from "../lib/get-admin-profile-label";
import { AdminProfileAvatar } from "./admin-profile-avatar";
import { AdminProfileDropdown } from "./admin-profile-dropdown";
import { AdminProfileSummary } from "./admin-profile-summary";

import "./admin-profile-menu.scss";

export function AdminProfileMenu() {
  const { data: me } = useMe();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileLabel = getAdminProfileLabel(me);

  useOutsideClick({
    ref: rootRef,
    enabled: isMenuOpen,
    onOutsideClick: () => setIsMenuOpen(false)
  });

  function toggleMenu() {
    setIsMenuOpen((value) => !value);
  }

  return (
    <div className="admin-profile-menu" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="menu"
        onClick={toggleMenu}
        aria-controls={menuId}
        aria-expanded={isMenuOpen}
        aria-label="Open admin menu"
        className={clsx("admin-profile-menu__trigger", {
          "admin-profile-menu__trigger--open": isMenuOpen
        })}
      >
        <AdminProfileAvatar imgUrl={me?.imgUrl} initials={profileLabel.initials} />
        <AdminProfileSummary name={profileLabel.name} role={profileLabel.role} />
      </button>

      {isMenuOpen && <AdminProfileDropdown id={menuId} />}
    </div>
  );
}
