import { useCrackSafeRules } from "@/entities/crack-safe-rules";
import { AdminCrackSafeRuleCreateTrigger } from "@/features/admin-create-crack-safe-rule";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { GridTable } from "@/shared/ui/grid-table";

import { AdminCrackSafeRuleRow } from "./admin-crack-safe-rule-row";

import "./admin-crack-safe-rules.scss";

const crackSafeRulesGridTemplateColumns =
  "minmax(100px, 1fr) minmax(80px, 0.4fr) minmax(40px, 0.4fr) minmax(60px, 0.4fr) minmax(60px, 0.5fr) minmax(150px, 0.75fr) minmax(150px, 0.75fr) minmax(100px, 0.4fr)";

const crackSafeRulesHeader = [
  "ID",
  "Game Date",
  "Code Length",
  "Jackpot",
  "Semi / Jackpot",
  "Created",
  "Updated",
  ""
];

export function AdminCrackSafeRules() {
  const crackSafeRulesQuery = useCrackSafeRules();
  const crackSafeRulesErrorMessage = getErrorMessage(
    crackSafeRulesQuery.error,
    "Unknown Crack Safe rules loading error"
  );

  return (
    <section className="admin-crack-safe-rules">
      <AdminPageHeader
        title="Crack Safe Rules"
        slot={
          <div className="admin-crack-safe-rules__actions">
            <AdminCrackSafeRuleCreateTrigger />
          </div>
        }
      />

      {crackSafeRulesQuery.isLoading ? (
        <p className="admin-crack-safe-rules__state" aria-live="polite">
          Loading Crack Safe rules...
        </p>
      ) : null}

      {crackSafeRulesQuery.isError ? (
        <p className="admin-crack-safe-rules__state admin-crack-safe-rules__state--error" role="alert">
          Failed to load Crack Safe rules. {crackSafeRulesErrorMessage}
        </p>
      ) : null}

      {crackSafeRulesQuery.data ? (
        <GridTable
          ariaLabel="Crack Safe Rules"
          header={crackSafeRulesHeader}
          items={crackSafeRulesQuery.data}
          emptyMessage="No Crack Safe rules found"
          className="admin-crack-safe-rules__table"
          gridTemplateColumns={crackSafeRulesGridTemplateColumns}
          renderRow={(rule) => (
            <AdminCrackSafeRuleRow gridTemplateColumns={crackSafeRulesGridTemplateColumns} rule={rule} />
          )}
        />
      ) : null}
    </section>
  );
}
