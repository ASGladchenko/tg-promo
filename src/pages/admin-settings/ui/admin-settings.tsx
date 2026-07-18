import { Link } from "react-router";

import { APP_ROUTES } from "@/shared/config";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";

import "./admin-settings.scss";

export function AdminSettings() {
  return (
    <section className="admin-settings">
      <AdminPageHeader title="Settings" />

      <div className="admin-settings__card" aria-label="Settings sections">
        <h2 className="admin-settings__card-title">AI settings</h2>
        <p className="admin-settings__card-description">Manage AI prompts, behavior and assistant defaults.</p>
        <Link className="admin-settings__card-link" to={`${APP_ROUTES.admin}/${APP_ROUTES.adminSettingsAi}`}>
          Open AI settings
        </Link>
      </div>
    </section>
  );
}
