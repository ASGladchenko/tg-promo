import { lazy, Suspense } from "react";

import { getUsersAnalyticsRange, useUsersAnalytics } from "@/entities/analytics";
import { getErrorMessage } from "@/shared/lib/error";
import { CircularProgressLoader } from "@/shared/ui/circular-progress-loader";

import { formatAdminAnalyticsNumber } from "../../lib/format-admin-analytics-number";
import { AdminAnalyticsCard } from "../admin-analytics-card";

const AdminTotalUsersChart = lazy(() =>
  import("../admin-total-users-chart").then(({ AdminTotalUsersChart }) => ({ default: AdminTotalUsersChart }))
);

export function AdminTotalUsersWidget() {
  const usersAnalyticsQuery = useUsersAnalytics(getUsersAnalyticsRange(1));
  const errorMessage = usersAnalyticsQuery.isError
    ? getErrorMessage(usersAnalyticsQuery.error, "Unknown users analytics loading error")
    : undefined;
  const totalUsers = usersAnalyticsQuery.data?.users.total;
  const newUsers = usersAnalyticsQuery.data?.users.new;

  return (
    <AdminAnalyticsCard
      title="Total users"
      value={formatAdminAnalyticsNumber(totalUsers)}
      meta={
        usersAnalyticsQuery.data
          ? `New today: ${formatAdminAnalyticsNumber(newUsers)}`
          : "All registered player users"
      }
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
          <AdminTotalUsersChart
            newUsers={usersAnalyticsQuery.data.users.new}
            totalUsers={usersAnalyticsQuery.data.users.total}
          />
        </Suspense>
      ) : null}
    </AdminAnalyticsCard>
  );
}
