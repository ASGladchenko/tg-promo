import clsx from "clsx";

import { type CrackSafeSnapshot } from "@/entities/crack-safe-snapshots";

import { formatAdminCrackSafeSnapshotDate } from "../../../lib/format-admin-crack-safe-snapshot-date";
import {
  isAdminCrackSafeSnapshotActive,
  isAdminCrackSafeSnapshotFinished
} from "../../../lib/get-admin-crack-safe-snapshot-status";

import "./admin-crack-safe-snapshot-schedule.scss";

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
    <section className="snapshot-details__panel snapshot-details__panel--schedule">
      <div className="snapshot-details__schedule-heading">
        <h2>Schedule</h2>
        <span
          className={clsx({
            "snapshot-details__schedule-date--active": isActive,
            "snapshot-details__schedule-date--finished": isFinished
          })}
        >
          {snapshot.gameDate}
        </span>
      </div>

      <dl className="snapshot-details__schedule">
        {scheduleItems.map((item) => (
          <div
            className={clsx("snapshot-details__schedule-item", {
              "snapshot-details__schedule-item--active": isActive,
              "snapshot-details__schedule-item--finished": isFinished
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
