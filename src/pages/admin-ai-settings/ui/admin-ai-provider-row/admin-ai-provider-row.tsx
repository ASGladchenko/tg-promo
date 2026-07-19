import type { CSSProperties } from "react";

import { type AiProvider, useUpdateAiProviderStatus } from "@/entities/ai-providers";
import { AdminAiProviderApiKeyModalTrigger } from "@/features/admin-update-ai-provider-api-key";
import { AdminAiProviderModelsModalTrigger } from "@/features/admin-view-ai-provider-models";
import { getErrorMessage } from "@/shared/lib/error";
import { notify } from "@/shared/lib/toast";
import { ButtonLoading } from "@/shared/ui/button-loading";

import { formatAdminAiProviderDate } from "../../lib/format-admin-ai-provider-date";

import "./admin-ai-provider-row.scss";

type AdminAiProviderRowProps = {
  gridTemplateColumns: string;
  provider: AiProvider;
};

export function AdminAiProviderRow({ provider, gridTemplateColumns }: AdminAiProviderRowProps) {
  const rowStyle = { "--grid-table-columns": gridTemplateColumns } as CSSProperties;
  const updateActiveStatus = useUpdateAiProviderStatus();
  const updateSelectedStatus = useUpdateAiProviderStatus();

  const toggleActive = async () => {
    try {
      await updateActiveStatus.mutateAsync({
        code: provider.code,
        payload: {
          isActive: !provider.isActive
        }
      });
    } catch (error) {
      notify.error(getErrorMessage(error, "Failed to update AI provider status"));
    }
  };

  const selectProvider = async () => {
    try {
      await updateSelectedStatus.mutateAsync({
        code: provider.code,
        payload: {
          isSelected: !provider.isSelected
        }
      });
    } catch (error) {
      notify.error(getErrorMessage(error, "Failed to update AI provider status"));
    }
  };

  return (
    <div className="ai-provider-row" role="row" style={rowStyle}>
      <div className="ai-provider-row__cell" role="cell">
        {provider.name}
      </div>

      <div className="ai-provider-row__cell" role="cell">
        {provider.code}
      </div>

      <div className="ai-provider-row__cell" role="cell">
        {provider.baseUrl}
      </div>

      <div className="ai-provider-row__cell ai-provider-row__cell--api-key" role="cell">
        <AdminAiProviderApiKeyModalTrigger
          code={provider.code}
          name={provider.name}
          hasApiKey={provider.hasApiKey}
        />
      </div>

      <div className="ai-provider-row__cell ai-provider-row__cell--selected-model" role="cell">
        <AdminAiProviderModelsModalTrigger
          code={provider.code}
          name={provider.name}
          selectedModel={provider.selectedModel}
        />
      </div>

      <div className="ai-provider-row__cell ai-provider-row__cell--status" role="cell">
        <ButtonLoading
          height={36}
          type="button"
          appearance="outline"
          onClick={() => void toggleActive()}
          disabled={updateActiveStatus.isPending}
          isLoading={updateActiveStatus.isPending}
          variant={provider.isActive ? "success" : "danger"}
          className="ai-provider-row__button ai-provider-row__button--active"
        >
          <span className="ai-provider-row__button-label">{provider.isActive ? "Active" : "Inactive"}</span>
        </ButtonLoading>
      </div>

      <div className="ai-provider-row__cell ai-provider-row__cell--status" role="cell">
        <ButtonLoading
          height={36}
          type="button"
          appearance="outline"
          onClick={() => void selectProvider()}
          disabled={updateSelectedStatus.isPending}
          isLoading={updateSelectedStatus.isPending}
          variant={provider.isSelected ? "success" : "danger"}
          className="ai-provider-row__button ai-provider-row__button--selected"
        >
          <span className="ai-provider-row__button-label">{provider.isSelected ? "Yes" : "No"}</span>
        </ButtonLoading>
      </div>

      <div className="ai-provider-row__cell" role="cell">
        {formatAdminAiProviderDate(provider.updatedAt)}
      </div>
    </div>
  );
}
