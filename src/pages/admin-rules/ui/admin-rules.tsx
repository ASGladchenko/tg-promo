import { useRules } from "@/entities/rules";
import { AdminRuleCreateTrigger } from "@/features/admin-create-rule";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { GridTable } from "@/shared/ui/grid-table";

import { AdminRuleRow } from "./admin-rule-row";

import "./admin-rules.scss";

const rulesGridTemplateColumns =
  "minmax(100px, 1fr) minmax(80px, 0.4fr) minmax(40px, 0.4fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) minmax(60px, 0.4fr) minmax(60px, 0.5fr) minmax(150px, 0.75fr) minmax(150px, 0.75fr) minmax(100px, 0.4fr)";

const rulesHeader = [
  "ID",
  "Game Date",
  "Code Length",
  "Jackpot Prize",
  "Semi Prize",
  "Jackpot Wins",
  "Semi Wins",
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
          renderRow={(rule) => <AdminRuleRow gridTemplateColumns={rulesGridTemplateColumns} rule={rule} />}
        />
      ) : null}
    </section>
  );
}
