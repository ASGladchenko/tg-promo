import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { AdminGameSchedule } from "@/widgets/admin-game-schedule";

import "./admin-schedule.scss";

export function AdminSchedule() {
  return (
    <section className="admin-schedule">
      <AdminPageHeader title="Schedule" />
      <AdminGameSchedule />
    </section>
  );
}
