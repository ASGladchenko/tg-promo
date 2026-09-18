import { lazy, Suspense, useCallback, useMemo, useState } from "react";

import { generatePath, useParams } from "react-router";

import { useLuckyMeadowUserSessions } from "@/entities/lucky-meadow";
import { APP_ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";

import { AdminLuckyMeadowSessionModal } from "./admin-lucky-meadow-session-modal";

import "./admin-lucky-meadow-user-sessions.scss";

const LazyAdminLuckyMeadowSessionsList = lazy(() =>
  import("./admin-lucky-meadow-sessions-list").then(({ AdminLuckyMeadowSessionsList }) => ({
    default: AdminLuckyMeadowSessionsList
  }))
);

export function AdminLuckyMeadowUserSessions() {
  const { id: userId, startDate } = useParams();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const sessionsQuery = useLuckyMeadowUserSessions(startDate, userId);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading
  } = sessionsQuery;
  const sessions = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;
  const errorMessage = getErrorMessage(error, "Unknown Lucky Meadow sessions loading error");
  const snapshotPath = startDate
    ? `${APP_ROUTES.admin}/${generatePath(APP_ROUTES.adminLuckyMeadowSnapshot, { startDate })}`
    : `${APP_ROUTES.admin}/${APP_ROUTES.adminSchedule}`;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage]);

  const handleRetryLoadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  const handleCloseModal = useCallback(() => {
    setSelectedSessionId(null);
  }, []);

  return (
    <section className="user-sessions">
      <AdminPageHeader backTo={snapshotPath} title="Lucky Meadow User Sessions" />

      <div className="user-sessions__summary">
        <span>Snapshot: {startDate ?? "—"}</span>
        <code title={userId}>User: {userId ?? "—"}</code>
        {data ? <span aria-live="polite">Sessions: {total}</span> : null}
      </div>

      {!startDate || !userId ? (
        <p className="user-sessions__state user-sessions__state--error" role="alert">
          Lucky Meadow snapshot date or user ID is missing.
        </p>
      ) : null}

      {isLoading ? (
        <p className="user-sessions__state" aria-live="polite">
          Loading Lucky Meadow sessions...
        </p>
      ) : null}

      {isError && !data ? (
        <p className="user-sessions__state user-sessions__state--error" role="alert">
          Failed to load Lucky Meadow sessions. {errorMessage}
        </p>
      ) : null}

      {data ? (
        <Suspense
          fallback={
            <p className="user-sessions__state" aria-live="polite">
              Loading sessions list...
            </p>
          }
        >
          <LazyAdminLuckyMeadowSessionsList
            hasNextPage={Boolean(hasNextPage)}
            isNextPageError={isFetchNextPageError}
            isNextPageLoading={isFetchingNextPage}
            items={sessions}
            onLoadMore={handleLoadMore}
            onOpenSession={setSelectedSessionId}
            onRetryLoadMore={handleRetryLoadMore}
            total={total}
          />
        </Suspense>
      ) : null}

      <AdminLuckyMeadowSessionModal
        onClose={handleCloseModal}
        startDate={startDate}
        userId={userId}
        userSnapshotId={selectedSessionId}
      />
    </section>
  );
}
