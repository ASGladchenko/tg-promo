import type { CSSProperties } from "react";

import { type AiProvider } from "@/entities/ai-providers";
import clsx from "clsx";

import { formatAdminAiProviderDate } from "../../lib/format-admin-ai-provider-date";

import "./admin-ai-provider-row.scss";

type AdminAiProviderRowProps = {
  gridTemplateColumns: string;
  provider: AiProvider;
};

export function AdminAiProviderRow({ provider, gridTemplateColumns }: AdminAiProviderRowProps) {
  const rowStyle = { "--grid-table-columns": gridTemplateColumns } as CSSProperties;

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

      <div className="ai-provider-row__cell" role="cell">
        {provider.hasApiKey ? "Set" : "Not set"}
      </div>

      <div className="ai-provider-row__cell" role="cell">
        {provider.selectedModel ?? "-"}
      </div>

      <div className="ai-provider-row__cell" role="cell">
        {provider.isActive ? "Active" : "Inactive"}
      </div>

      <div className="ai-provider-row__cell" role="cell">
        <span
          className={clsx("ai-provider-row__selected", {
            "ai-provider-row__selected--active": provider.isSelected
          })}
        >
          {provider.isSelected ? "Yes" : "No"}
        </span>
      </div>

      <div className="ai-provider-row__cell" role="cell">
        {formatAdminAiProviderDate(provider.updatedAt)}
      </div>
    </div>
  );
}
