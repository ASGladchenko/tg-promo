import clsx from "clsx";

import { type CrackSafeSnapshot } from "@/entities/crack-safe-snapshots";

import { formatAdminCrackSafeSnapshotDate } from "../lib/format-admin-crack-safe-snapshot-date";
import {
  isAdminCrackSafeSnapshotActive,
  isAdminCrackSafeSnapshotFinished
} from "../lib/get-admin-crack-safe-snapshot-status";

type AdminCrackSafeSnapshotScheduleProps = {
  snapshot: CrackSafeSnapshot;
};

const scheduleItems = [
  { field: "startsAt", label: "Starts" },
  { field: "endsAt", label: "Ends" },
  { field: "createdAt", label: "Created" },
  { field: "updatedAt", label: "Updated" }
] as const;

export function AdminCrackSafeSnapshotSchedule({ snapshot }: AdminCrackSafeSnapshotScheduleProps) {
  const isActive = isAdminCrackSafeSnapshotActive(snapshot.status);
  const isFinished = isAdminCrackSafeSnapshotFinished(snapshot.status);

  return (
    <section className="admin-crack-safe-snapshot-details__panel admin-crack-safe-snapshot-details__panel--schedule">
      <div className="admin-crack-safe-snapshot-details__schedule-heading">
        <h2>Schedule</h2>
        <span
          className={clsx({
            "admin-crack-safe-snapshot-details__schedule-date--active": isActive,
            "admin-crack-safe-snapshot-details__schedule-date--finished": isFinished
          })}
        >
          {snapshot.gameDate}
        </span>
      </div>

      <dl className="admin-crack-safe-snapshot-details__schedule">
        {scheduleItems.map((item) => (
          <div
            className={clsx("admin-crack-safe-snapshot-details__schedule-item", {
              "admin-crack-safe-snapshot-details__schedule-item--active": isActive,
              "admin-crack-safe-snapshot-details__schedule-item--finished": isFinished
            })}
            key={item.field}
          >
            <dt>{item.label}</dt>
            <dd>{formatAdminCrackSafeSnapshotDate(snapshot[item.field])}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
