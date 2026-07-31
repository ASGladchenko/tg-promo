import { lazy, Suspense } from "react";

import { getUsersAnalyticsRange, useUsersAnalytics } from "@/entities/analytics";
import { getErrorMessage } from "@/shared/lib/error";
import { CircularProgressLoader } from "@/shared/ui/circular-progress-loader";

import { formatAdminAnalyticsNumber } from "../../lib/format-admin-analytics-number";
import { AdminAnalyticsCard } from "../admin-analytics-card";

const AdminActiveUsersChart = lazy(() =>
  import("../admin-active-users-chart").then(({ AdminActiveUsersChart }) => ({
    default: AdminActiveUsersChart
  }))
);

export function AdminActiveUsersWidget() {
  const usersAnalyticsQuery = useUsersAnalytics(getUsersAnalyticsRange(1));
  const errorMessage = usersAnalyticsQuery.isError
    ? getErrorMessage(usersAnalyticsQuery.error, "Unknown users analytics loading error")
    : undefined;
  const dau = usersAnalyticsQuery.data?.activeUsers.dau;
  const wau = usersAnalyticsQuery.data?.activeUsers.wau;
  const mau = usersAnalyticsQuery.data?.activeUsers.mau;

  return (
    <AdminAnalyticsCard
      title="Active users"
      value={formatAdminAnalyticsNumber(dau)}
      meta={`WAU: ${formatAdminAnalyticsNumber(wau)} / MAU: ${formatAdminAnalyticsNumber(mau)}`}
      isLoading={usersAnalyticsQuery.isLoading}
      errorMessage={errorMessage}
    >
      {usersAnalyticsQuery.data ? (
        <Suspense
          fallback={
            <div className="analytics-card__chart-loader">
              <CircularProgressLoader label="Loading chart" size={34} />
            </div>
          }
        >
          <AdminActiveUsersChart
            dau={usersAnalyticsQuery.data.activeUsers.dau}
            wau={usersAnalyticsQuery.data.activeUsers.wau}
            mau={usersAnalyticsQuery.data.activeUsers.mau}
          />
        </Suspense>
      ) : null}
    </AdminAnalyticsCard>
  );
}
