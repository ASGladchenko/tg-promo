import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { useParams } from "react-router";

import { useLuckyMeadowPeriodUsers, useLuckyMeadowSnapshotStats } from "@/entities/lucky-meadow";
import { APP_ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { Input } from "@/shared/ui/input";

import { AdminLuckyMeadowSnapshotOverview } from "./admin-lucky-meadow-snapshot-overview";

import "./admin-lucky-meadow-snapshot.scss";

const SEARCH_DEBOUNCE_MS = 300;

const LazyAdminLuckyMeadowUsersTable = lazy(() =>
  import("./admin-lucky-meadow-users-table").then(({ AdminLuckyMeadowUsersTable }) => ({
    default: AdminLuckyMeadowUsersTable
  }))
);

export function AdminLuckyMeadowSnapshot() {
  const { startDate } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const statsQuery = useLuckyMeadowSnapshotStats(startDate);
  const usersQuery = useLuckyMeadowPeriodUsers(startDate, search);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading
  } = usersQuery;
  const users = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;
  const errorMessage = getErrorMessage(error, "Unknown Lucky Meadow users loading error");
  const statsErrorMessage = getErrorMessage(
    statsQuery.error,
    "Unknown Lucky Meadow snapshot stats loading error"
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage]);

  const handleRetryLoadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  return (
    <section className="lucky-meadow-snapshot">
      <AdminPageHeader
        backTo={`${APP_ROUTES.admin}/${APP_ROUTES.adminSchedule}`}
        title="Lucky Meadow Snapshot"
      />

      {statsQuery.isLoading ? (
        <p className="lucky-meadow-snapshot__state" aria-live="polite">
          Loading Lucky Meadow snapshot summary...
        </p>
      ) : null}

      {statsQuery.isError && !statsQuery.data ? (
        <p className="lucky-meadow-snapshot__state lucky-meadow-snapshot__state--error" role="alert">
          Failed to load Lucky Meadow snapshot summary. {statsErrorMessage}
        </p>
      ) : null}

      {statsQuery.data ? <AdminLuckyMeadowSnapshotOverview stats={statsQuery.data} /> : null}

      <div className="lucky-meadow-snapshot__toolbar">
        <Input
          aria-label="Search Lucky Meadow users"
          autoComplete="off"
          maxLength={100}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name or user ID"
          type="search"
          value={searchInput}
        />

        {data ? (
          <span className="lucky-meadow-snapshot__count" aria-live="polite">
            {total} users
          </span>
        ) : null}
      </div>

      {!startDate ? (
        <p className="lucky-meadow-snapshot__state lucky-meadow-snapshot__state--error" role="alert">
          Lucky Meadow snapshot date is missing.
        </p>
      ) : null}

      {isLoading ? (
        <p className="lucky-meadow-snapshot__state" aria-live="polite">
          Loading Lucky Meadow users...
        </p>
      ) : null}

      {isError && !data ? (
        <p className="lucky-meadow-snapshot__state lucky-meadow-snapshot__state--error" role="alert">
          Failed to load Lucky Meadow users. {errorMessage}
        </p>
      ) : null}

      {data ? (
        <Suspense
          fallback={
            <p className="lucky-meadow-snapshot__state" aria-live="polite">
              Loading users table...
            </p>
          }
        >
          <LazyAdminLuckyMeadowUsersTable
            hasNextPage={Boolean(hasNextPage)}
            isNextPageError={isFetchNextPageError}
            isNextPageLoading={isFetchingNextPage}
            items={users}
            onLoadMore={handleLoadMore}
            onRetryLoadMore={handleRetryLoadMore}
            startDate={startDate ?? ""}
            total={total}
          />
        </Suspense>
      ) : null}
    </section>
  );
}
