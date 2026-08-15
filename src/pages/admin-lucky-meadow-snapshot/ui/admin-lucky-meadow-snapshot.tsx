import { APP_ROUTES } from "@/shared/config";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";

import "./admin-lucky-meadow-snapshot.scss";

export function AdminLuckyMeadowSnapshot() {
  return (
    <section className="lucky-meadow-snapshot">
      <AdminPageHeader
        backTo={`${APP_ROUTES.admin}/${APP_ROUTES.adminSchedule}`}
        title="Lucky Meadow Snapshot"
      />

      <p className="lucky-meadow-snapshot__message">Lucky Meadow snapshot will be available soon.</p>
    </section>
  );
}
