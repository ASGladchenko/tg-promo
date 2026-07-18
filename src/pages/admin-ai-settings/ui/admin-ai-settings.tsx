import { APP_ROUTES } from "@/shared/config";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";

import "./admin-ai-settings.scss";

export function AdminAiSettings() {
  return (
    <section className="admin-ai-settings">
      <AdminPageHeader backTo={`${APP_ROUTES.admin}/${APP_ROUTES.adminSettings}`} title="AI settings" />

      <p className="admin-ai-settings__state">AI settings will appear here.</p>
    </section>
  );
}
