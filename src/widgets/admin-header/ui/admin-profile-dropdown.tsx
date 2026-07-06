import type { ComponentType, ReactNode, SVGProps } from "react";

import { AdminLogoutButton } from "@/features/admin-logout";
import LogoutIcon from "@/shared/svg/logout.svg?react";

import "./admin-profile-dropdown.scss";

type AdminProfileDropdownItem = {
  element: ReactNode;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  id: string;
};

const adminProfileDropdownItems: AdminProfileDropdownItem[] = [
  {
    id: "logout",
    Icon: LogoutIcon,
    element: <AdminLogoutButton />
  }
];

type AdminProfileDropdownProps = {
  id: string;
};

export function AdminProfileDropdown({ id }: AdminProfileDropdownProps) {
  return (
    <div className="admin-profile-dropdown" id={id} role="menu">
      {adminProfileDropdownItems.map(({ Icon, element, id: itemId }) => (
        <div className="admin-profile-dropdown__item" role="none" key={itemId}>
          <Icon aria-hidden="true" focusable="false" />
          {element}
        </div>
      ))}
    </div>
  );
}
