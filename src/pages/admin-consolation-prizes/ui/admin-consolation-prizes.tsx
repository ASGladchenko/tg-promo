import { useConsolationPrizes } from "@/entities/consolation-prizes";
import { usePrizes } from "@/entities/prizes";
import { AdminConsolationPrizeCreateTrigger } from "@/features/admin-create-consolation-prize";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { GridTable } from "@/shared/ui/grid-table";

import { AdminConsolationPrizeRow } from "./admin-consolation-prize-row";

import "./admin-consolation-prizes.scss";

const gridTemplateColumns =
  "minmax(220px, 1.2fr) minmax(180px, 1fr) minmax(150px, .8fr) minmax(200px, 1fr) minmax(160px, .8fr) minmax(90px, .5fr) minmax(160px, .8fr) minmax(160px, .8fr) minmax(90px, .5fr)";
const header = ["ID", "Prize", "Promo code", "Description", "Expires", "Active", "Created", "Updated", ""];

export function AdminConsolationPrizes() {
  const consolationPrizesQuery = useConsolationPrizes();
  const prizesQuery = usePrizes();
  const error = consolationPrizesQuery.error ?? prizesQuery.error;

  return (
    <section className="admin-consolation-prizes">
      <AdminPageHeader title="Consolation prizes" slot={<AdminConsolationPrizeCreateTrigger />} />
      {consolationPrizesQuery.isLoading || prizesQuery.isLoading ? (
        <p className="admin-consolation-prizes__state" aria-live="polite">
          Loading consolation prizes...
        </p>
      ) : null}

      {error ? (
        <p className="admin-consolation-prizes__state admin-consolation-prizes__state--error" role="alert">
          Failed to load consolation prizes. {getErrorMessage(error, "Unknown loading error")}
        </p>
      ) : null}

      {consolationPrizesQuery.data && prizesQuery.data ? (
        <GridTable
          ariaLabel="Consolation prizes"
          header={header}
          items={consolationPrizesQuery.data}
          emptyMessage="No consolation prizes found"
          gridTemplateColumns={gridTemplateColumns}
          renderRow={(consolationPrize) => (
            <AdminConsolationPrizeRow
              consolationPrize={consolationPrize}
              prizes={prizesQuery.data}
              gridTemplateColumns={gridTemplateColumns}
            />
          )}
        />
      ) : null}
    </section>
  );
}
