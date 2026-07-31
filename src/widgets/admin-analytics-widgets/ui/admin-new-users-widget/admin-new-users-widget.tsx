import { lazy, Suspense, useState } from "react";

import { getUsersAnalyticsRange, useUsersAnalytics } from "@/entities/analytics";
import { getErrorMessage } from "@/shared/lib/error";
import { CircularProgressLoader } from "@/shared/ui/circular-progress-loader";
import { Select } from "@/shared/ui/select";
import { SelectOption } from "@/shared/ui/select-option";

import { formatAdminAnalyticsNumber } from "../../lib/format-admin-analytics-number";
import { AdminAnalyticsCard } from "../admin-analytics-card";

const AdminNewUsersChart = lazy(() =>
  import("../admin-new-users-chart").then(({ AdminNewUsersChart }) => ({ default: AdminNewUsersChart }))
);

const newUsersDayOptions = [1, 3, 7, 10, 14, 31] as const;
type NewUsersDayOption = (typeof newUsersDayOptions)[number];

function formatDayOption(dayCount: NewUsersDayOption): string {
  return dayCount === 1 ? "1 day" : `${dayCount} days`;
}

export function AdminNewUsersWidget() {
  const [dayCount, setDayCount] = useState<NewUsersDayOption>(7);
  const usersAnalyticsQuery = useUsersAnalytics(getUsersAnalyticsRange(dayCount));
  const errorMessage = usersAnalyticsQuery.isError
    ? getErrorMessage(usersAnalyticsQuery.error, "Unknown users analytics loading error")
    : undefined;
  const newUsers = usersAnalyticsQuery.data?.users.new;
  const newFromReferralUsers = usersAnalyticsQuery.data?.users.newFromReferral;

  function handleDayCountChange(value: string) {
    const nextDayCount = Number(value) as NewUsersDayOption;

    if (newUsersDayOptions.includes(nextDayCount)) {
      setDayCount(nextDayCount);
    }
  }

  return (
    <AdminAnalyticsCard
      title="New users"
      value={formatAdminAnalyticsNumber(newUsers)}
      meta={`Referral: ${formatAdminAnalyticsNumber(newFromReferralUsers)}`}
      isLoading={usersAnalyticsQuery.isLoading}
      errorMessage={errorMessage}
      actions={
        <Select
          label="Period"
          value={String(dayCount)}
          displayValue={`Last ${formatDayOption(dayCount)}`}
          optionsCount={newUsersDayOptions.length}
          onValueChange={handleDayCountChange}
          renderOptions={({ onSelect, value }) =>
            newUsersDayOptions.map((option) => (
              <SelectOption
                key={option}
                value={String(option)}
                isSelected={value === String(option)}
                onSelect={onSelect}
              >
                {formatDayOption(option)}
              </SelectOption>
            ))
          }
        />
      }
    >
      {usersAnalyticsQuery.data ? (
        <Suspense
          fallback={
            <div className="analytics-card__chart-loader">
              <CircularProgressLoader label="Loading chart" size={34} />
            </div>
          }
        >
          <AdminNewUsersChart
            newUsers={usersAnalyticsQuery.data.users.new}
            newFromReferralUsers={usersAnalyticsQuery.data.users.newFromReferral}
          />
        </Suspense>
      ) : null}
    </AdminAnalyticsCard>
  );
}
