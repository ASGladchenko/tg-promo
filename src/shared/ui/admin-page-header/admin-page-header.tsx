import type { ReactNode } from "react";

import { Link } from "react-router";

import ChevronDownIcon from "@/shared/svg/chevron-down.svg?react";

import "./admin-page-header.scss";

type AdminPageHeaderProps = {
  backTo?: string;
  slot?: ReactNode;
  title: string;
};

export function AdminPageHeader({ title, backTo, slot }: AdminPageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-header__content">
        <div className="admin-page-header__heading">
          {backTo ? (
            <Link className="admin-page-header__back" to={backTo} aria-label="Go back">
              <ChevronDownIcon aria-hidden="true" />
            </Link>
          ) : null}

          <h1 className="admin-page-header__title">{title}</h1>
        </div>

        {slot}
      </div>

      <div className="admin-page-header__divider" />
    </header>
  );
}
