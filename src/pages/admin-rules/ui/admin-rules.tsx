import { useRules } from "@/entities/rules";
import { AdminCreateTodayRuleButton } from "@/features/admin-create-today-rule";
import { AdminRuleCreateTrigger } from "@/features/admin-create-rule";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { GridTable } from "@/shared/ui/grid-table";

import { AdminRuleRow } from "./admin-rule-row";

import "./admin-rules.scss";

const rulesGridTemplateColumns =
  "minmax(100px, 0.6fr) minmax(130px, 0.7fr) minmax(110px, 0.55fr) minmax(260px, 1.25fr) minmax(260px, 1.25fr) minmax(140px, 0.65fr) minmax(170px, 0.75fr) minmax(150px, 0.75fr) minmax(150px, 0.75fr) minmax(90px, 0.6fr)";

const rulesHeader = [
  "ID",
  "Game Date",
  "Code Length",
  "Jackpot Prize",
  "Semi-Jackpot Prize",
  "Jackpot Wins",
  "Semi-Jackpot Wins",
  "Created",
  "Updated",
  ""
];

export function AdminRules() {
  const rulesQuery = useRules();
  const rulesErrorMessage = getErrorMessage(rulesQuery.error, "Unknown rules loading error");

  return (
    <section className="admin-rules">
      <AdminPageHeader
        title="Rules"
        slot={
          <div className="admin-rules__actions">
            <AdminCreateTodayRuleButton />
            <AdminRuleCreateTrigger />
          </div>
        }
      />

      {rulesQuery.isLoading ? (
        <p className="admin-rules__state" aria-live="polite">
          Loading rules...
        </p>
      ) : null}

      {rulesQuery.isError ? (
        <p className="admin-rules__state admin-rules__state--error" role="alert">
          Failed to load rules. {rulesErrorMessage}
        </p>
      ) : null}

      {rulesQuery.data ? (
        <GridTable
          ariaLabel="Rules"
          header={rulesHeader}
          items={rulesQuery.data}
          emptyMessage="No rules found"
          gridTemplateColumns={rulesGridTemplateColumns}
          renderRow={(rule) => (
            <AdminRuleRow gridTemplateColumns={rulesGridTemplateColumns} rule={rule} />
          )}
        />
      ) : null}
    </section>
  );
}
