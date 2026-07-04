import { usePrizes } from "@/entities/prizes";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { ButtonBase } from "@/shared/ui/button-base";
import { GridTable } from "@/shared/ui/grid-table";

import { AdminPrizeRow } from "./admin-prize-row";

import "./admin-prizes.scss";

const prizesGridTemplateColumns = "420px 220px 320px 160px 160px 220px";

const prizesHeader = ["ID", "Title", "Description", "Amount", "Status", ""];

export function AdminPrizes() {
  const prizesQuery = usePrizes();

  return (
    <section className="admin-prizes">
      <AdminPageHeader title="Prizes" slot={<ButtonBase>Add Prize</ButtonBase>} />

      {prizesQuery.isLoading ? (
        <p className="admin-prizes__state" aria-live="polite">
          Loading prizes...
        </p>
      ) : null}

      {prizesQuery.isError ? (
        <p className="admin-prizes__state admin-prizes__state--error" role="alert">
          Failed to load prizes.
        </p>
      ) : null}

      {prizesQuery.data ? (
        <GridTable
          ariaLabel="Prizes"
          header={prizesHeader}
          items={prizesQuery.data}
          emptyMessage="No prizes found"
          gridTemplateColumns={prizesGridTemplateColumns}
          renderRow={(prize) => <AdminPrizeRow prize={prize} />}
        />
      ) : null}
    </section>
  );
}
