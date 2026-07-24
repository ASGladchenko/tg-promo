import { useNavigate } from "react-router";

import { TelegramChannelLanguageSettingsPanel } from "@/entities/settings";
import { APP_ROUTES } from "@/shared/config";
import { ButtonBase } from "@/shared/ui/button-base";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";

import "./admin-settings.scss";

export function AdminSettings() {
  const navigate = useNavigate();

  return (
    <section className="admin-settings">
      <AdminPageHeader title="Settings" />

      <div className="admin-settings__grid">
        <TelegramChannelLanguageSettingsPanel />

        <div className="admin-settings__card" aria-label="AI settings">
          <h2 className="admin-settings__card-title">AI settings</h2>
          <p className="admin-settings__card-description">API and model setup.</p>
          <ButtonBase
            type="button"
            className="admin-settings__card-action"
            onClick={() => navigate(`${APP_ROUTES.admin}/${APP_ROUTES.adminSettingsAi}`)}
          >
            Open AI settings
          </ButtonBase>
        </div>
      </div>
    </section>
  );
}
