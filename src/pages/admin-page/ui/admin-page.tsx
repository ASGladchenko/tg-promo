import {
  AdminActiveUsersWidget,
  AdminNewUsersWidget,
  AdminTotalUsersWidget
} from "@/widgets/admin-analytics-widgets";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";

import "./admin-page.scss";

export function AdminPage() {
  return (
    <section className="admin-page">
      <AdminPageHeader title="Analytics" />

      <div className="admin-page__grid">
        <AdminTotalUsersWidget />
        <AdminNewUsersWidget />
        <AdminActiveUsersWidget />
      </div>
    </section>
  );
}
