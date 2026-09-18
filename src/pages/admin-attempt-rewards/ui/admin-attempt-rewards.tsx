import { useWalletAttemptRewardsSettings } from "@/entities/settings";
import { APP_ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { ButtonBase } from "@/shared/ui/button-base";

import { AdminAttemptRewardsForm } from "./admin-attempt-rewards-form";

import "./admin-attempt-rewards.scss";

export function AdminAttemptRewards() {
  const settingsQuery = useWalletAttemptRewardsSettings();
  const errorMessage = getErrorMessage(settingsQuery.error, "Unknown attempt rewards settings loading error");

  return (
    <section className="admin-attempt-rewards">
      <AdminPageHeader backTo={`${APP_ROUTES.admin}/${APP_ROUTES.adminSettings}`} title="Attempt rewards" />

      {settingsQuery.isLoading ? (
        <p className="admin-attempt-rewards__state" aria-live="polite">
          Loading attempt rewards...
        </p>
      ) : null}

      {settingsQuery.isError && !settingsQuery.data ? (
        <div className="admin-attempt-rewards__error" role="alert">
          <p className="admin-attempt-rewards__error-text">Failed to load attempt rewards. {errorMessage}</p>
          <ButtonBase
            type="button"
            appearance="outline"
            variant="danger"
            disabled={settingsQuery.isFetching}
            onClick={() => void settingsQuery.refetch()}
          >
            Retry
          </ButtonBase>
        </div>
      ) : null}

      {settingsQuery.data ? <AdminAttemptRewardsForm settings={settingsQuery.data} /> : null}
    </section>
  );
}
