import { usePrizes } from "@/entities/prizes";
import { AdminPrizeCreateTrigger } from "@/features/admin-create-prize";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { GridTable } from "@/shared/ui/grid-table";

import { AdminPrizeRow } from "./admin-prize-row";

import "./admin-prizes.scss";

const prizesGridTemplateColumns =
  "minmax(240px, 1.4fr) minmax(160px, 0.9fr) minmax(220px, 1.2fr) minmax(90px, 0.45fr) minmax(220px, 1.1fr) minmax(150px, 0.75fr) minmax(150px, 0.75fr) minmax(90px, 0.6fr)";

const prizesHeader = ["ID", "Name", "Description", "Active", "Metadata", "Created", "Updated", ""];

export function AdminPrizes() {
  const prizesQuery = usePrizes();
  const prizesErrorMessage = getErrorMessage(prizesQuery.error, "Unknown prizes loading error");

  return (
    <section className="admin-prizes">
      <AdminPageHeader title="Prizes" slot={<AdminPrizeCreateTrigger />} />

      {prizesQuery.isLoading ? (
        <p className="admin-prizes__state" aria-live="polite">
          Loading prizes...
        </p>
      ) : null}

      {prizesQuery.isError ? (
        <p className="admin-prizes__state admin-prizes__state--error" role="alert">
          Failed to load prizes. {prizesErrorMessage}
        </p>
      ) : null}

      {prizesQuery.data ? (
        <GridTable
          ariaLabel="Prizes"
          header={prizesHeader}
          items={prizesQuery.data}
          emptyMessage="No prizes found"
          gridTemplateColumns={prizesGridTemplateColumns}
          renderRow={(prize) => (
            <AdminPrizeRow gridTemplateColumns={prizesGridTemplateColumns} prize={prize} />
          )}
        />
      ) : null}
    </section>
  );
}
