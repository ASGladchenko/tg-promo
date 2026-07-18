import { useCrackSafeHistory } from "@/entities/crack-safe-history";
import { useCrackSafeSnapshots } from "@/entities/crack-safe-snapshots";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { GridTable } from "@/shared/ui/grid-table";

import { AdminCrackSafeSnapshotRow } from "./admin-crack-safe-snapshot-row";

import "./admin-crack-safe-snapshots.scss";

const crackSafeSnapshotsGridTemplateColumns =
  "minmax(100px, 1fr) minmax(80px, 0.45fr) minmax(70px, 0.45fr) minmax(40px, 0.35fr) minmax(60px, 0.4fr) minmax(60px, 0.4fr) minmax(70px, 0.6fr) minmax(70px, 0.6fr) minmax(150px, 0.75fr) minmax(150px, 0.75fr) minmax(100px, 0.75fr)";

const crackSafeSnapshotsHeader = [
  "ID",
  "Game Date",
  "Status",
  "Code Length",
  "Jackpot",
  "Semi / Jackpot",
  "Jackpot Wins",
  "Semi Wins / All",
  "Starts",
  "Ends",
  "Rules ID"
];

export function AdminCrackSafeSnapshots() {
  const historyQuery = useCrackSafeHistory();
  const crackSafeSnapshotsQuery = useCrackSafeSnapshots();
  const crackSafeSnapshotsErrorMessage = getErrorMessage(
    crackSafeSnapshotsQuery.error,
    "Unknown Crack Safe snapshots loading error"
  );

  return (
    <section className="admin-crack-safe-snapshots">
      <AdminPageHeader title="Crack Safe Snapshots" />

      {crackSafeSnapshotsQuery.isLoading ? (
        <p className="admin-crack-safe-snapshots__state" aria-live="polite">
          Loading Crack Safe snapshots...
        </p>
      ) : null}

      {crackSafeSnapshotsQuery.isError ? (
        <p
          className="admin-crack-safe-snapshots__state admin-crack-safe-snapshots__state--error"
          role="alert"
        >
          Failed to load Crack Safe snapshots. {crackSafeSnapshotsErrorMessage}
        </p>
      ) : null}

      {crackSafeSnapshotsQuery.data ? (
        <GridTable
          ariaLabel="Crack Safe Snapshots"
          header={crackSafeSnapshotsHeader}
          items={crackSafeSnapshotsQuery.data}
          emptyMessage="No Crack Safe snapshots found"
          gridTemplateColumns={crackSafeSnapshotsGridTemplateColumns}
          renderRow={(snapshot) => (
            <AdminCrackSafeSnapshotRow
              gridTemplateColumns={crackSafeSnapshotsGridTemplateColumns}
              semiJackpotWinsCount={
                historyQuery.data?.filter(
                  (item) => item.gameDate === snapshot.gameDate && item.outcome === "semi_jackpot"
                ).length ?? 0
              }
              snapshot={snapshot}
            />
          )}
        />
      ) : null}
    </section>
  );
}
