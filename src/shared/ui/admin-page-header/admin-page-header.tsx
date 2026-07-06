import type { ReactNode } from "react";

import "./admin-page-header.scss";

type AdminPageHeaderProps = {
  slot?: ReactNode;
  title: string;
};

export function AdminPageHeader({ title, slot }: AdminPageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-header__content">
        <h1 className="admin-page-header__title">{title}</h1>
        {slot}
      </div>

      <div className="admin-page-header__divider" />
    </header>
  );
}
