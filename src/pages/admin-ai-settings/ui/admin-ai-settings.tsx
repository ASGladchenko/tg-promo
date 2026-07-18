import { useAiProviders } from "@/entities/ai-providers";
import { AdminAiProviderCreateTrigger } from "@/features/admin-create-ai-provider";
import { APP_ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { GridTable } from "@/shared/ui/grid-table";

import { AdminAiProviderRow } from "./admin-ai-provider-row";

import "./admin-ai-settings.scss";

const aiProvidersGridTemplateColumns =
  "minmax(160px, 0.8fr) minmax(180px, 0.8fr) minmax(260px, 1.4fr) minmax(100px, 0.5fr) minmax(160px, 0.8fr) minmax(90px, 0.45fr) minmax(100px, 0.5fr) minmax(160px, 0.8fr)";

const aiProvidersHeader = [
  "Name",
  "Code",
  "Base URL",
  "API key",
  "Selected model",
  "Active",
  "Selected",
  "Updated"
];

export function AdminAiSettings() {
  const aiProvidersQuery = useAiProviders();

  const aiProvidersErrorMessage = getErrorMessage(
    aiProvidersQuery.error,
    "Unknown AI providers loading error"
  );

  return (
    <section className="admin-ai-settings">
      <AdminPageHeader
        backTo={`${APP_ROUTES.admin}/${APP_ROUTES.adminSettings}`}
        title="AI settings"
        slot={<AdminAiProviderCreateTrigger />}
      />

      {aiProvidersQuery.isLoading ? (
        <p className="admin-ai-settings__state" aria-live="polite">
          Loading AI providers...
        </p>
      ) : null}

      {aiProvidersQuery.isError ? (
        <p className="admin-ai-settings__state admin-ai-settings__state--error" role="alert">
          Failed to load AI providers. {aiProvidersErrorMessage}
        </p>
      ) : null}

      {aiProvidersQuery.data ? (
        <GridTable
          ariaLabel="AI providers"
          className="admin-ai-settings__table"
          header={aiProvidersHeader}
          items={aiProvidersQuery.data}
          emptyMessage="No AI providers found"
          gridTemplateColumns={aiProvidersGridTemplateColumns}
          renderRow={(provider) => (
            <AdminAiProviderRow gridTemplateColumns={aiProvidersGridTemplateColumns} provider={provider} />
          )}
        />
      ) : null}
    </section>
  );
}
