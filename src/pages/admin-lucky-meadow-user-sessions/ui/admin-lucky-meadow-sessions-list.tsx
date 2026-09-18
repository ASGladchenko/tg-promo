import { useCallback } from "react";

import { List } from "react-window";

import { type LuckyMeadowUserSession } from "@/entities/lucky-meadow";

import {
  AdminLuckyMeadowSessionRow,
  type AdminLuckyMeadowSessionRowData
} from "./admin-lucky-meadow-session-row";

import "./admin-lucky-meadow-sessions-list.scss";

const ROW_HEIGHT = 76;
const LOAD_MORE_THRESHOLD = 8;

type AdminLuckyMeadowSessionsListProps = {
  hasNextPage: boolean;
  isNextPageError: boolean;
  isNextPageLoading: boolean;
  items: readonly LuckyMeadowUserSession[];
  onLoadMore: () => void;
  onOpenSession: (userSnapshotId: string) => void;
  onRetryLoadMore: () => void;
  total: number;
};

function getRowKey(index: number, data: AdminLuckyMeadowSessionRowData) {
  return data.items[index]?.userSnapshotId ?? "load-more";
}

export function AdminLuckyMeadowSessionsList({
  hasNextPage,
  isNextPageError,
  isNextPageLoading,
  items,
  onLoadMore,
  onOpenSession,
  onRetryLoadMore,
  total
}: AdminLuckyMeadowSessionsListProps) {
  const rowCount = items.length + (hasNextPage ? 1 : 0);
  const handleRowsRendered = useCallback(
    ({ stopIndex }: { stopIndex: number }) => {
      if (
        hasNextPage &&
        !isNextPageError &&
        !isNextPageLoading &&
        stopIndex >= items.length - LOAD_MORE_THRESHOLD
      ) {
        onLoadMore();
      }
    },
    [hasNextPage, isNextPageError, isNextPageLoading, items.length, onLoadMore]
  );

  return (
    <div className="sessions-list" aria-label="Lucky Meadow user sessions">
      <div className="sessions-list__scroll admin-hover-scrollbar" tabIndex={0}>
        <div className="sessions-list__content">
          <div className="sessions-list__header" aria-hidden="true">
            <div>Session ID</div>
            <div>Status</div>
            <div>Outcome</div>
            <div>Jackpot / Lucky</div>
            <div>Semi-prize</div>
            <div>Started</div>
            <div>Finished</div>
          </div>

          {rowCount > 0 ? (
            <List
              aria-label="Lucky Meadow sessions"
              className="sessions-list__viewport admin-hover-scrollbar"
              onRowsRendered={handleRowsRendered}
              overscanCount={5}
              rowComponent={AdminLuckyMeadowSessionRow}
              rowCount={rowCount}
              rowHeight={ROW_HEIGHT}
              rowKey={getRowKey}
              rowProps={{
                items,
                loadMoreStatus: isNextPageError ? "error" : "loading",
                onOpenSession,
                onRetryLoadMore
              }}
              tabIndex={0}
            />
          ) : (
            <p className="sessions-list__empty">No Lucky Meadow sessions found</p>
          )}
        </div>
      </div>
      <span className="sessions-list__total" aria-hidden="true">
        {items.length} / {total}
      </span>
    </div>
  );
}
