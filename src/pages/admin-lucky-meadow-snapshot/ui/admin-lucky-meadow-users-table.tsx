import { useCallback } from "react";

import { List } from "react-window";

import { type LuckyMeadowPeriodUser } from "@/entities/lucky-meadow";

import { AdminLuckyMeadowUserRow, type AdminLuckyMeadowUserRowData } from "./admin-lucky-meadow-user-row";

import "./admin-lucky-meadow-users-table.scss";

const ROW_HEIGHT = 68;
const LOAD_MORE_THRESHOLD = 8;

type AdminLuckyMeadowUsersTableProps = {
  hasNextPage: boolean;
  isNextPageError: boolean;
  isNextPageLoading: boolean;
  items: readonly LuckyMeadowPeriodUser[];
  onLoadMore: () => void;
  onRetryLoadMore: () => void;
  startDate: string;
  total: number;
};

function getRowKey(index: number, data: AdminLuckyMeadowUserRowData) {
  return data.items[index]?.userSnapshotId ?? "load-more";
}

export function AdminLuckyMeadowUsersTable({
  hasNextPage,
  isNextPageError,
  isNextPageLoading,
  items,
  onLoadMore,
  onRetryLoadMore,
  startDate,
  total
}: AdminLuckyMeadowUsersTableProps) {
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
    <div className="users-table" role="table" aria-label="Lucky Meadow users" aria-rowcount={total + 1}>
      <div className="users-table__scroll admin-hover-scrollbar" tabIndex={0}>
        <div className="users-table__content">
          <div role="rowgroup">
            <div className="users-table__header" role="row">
              <div role="columnheader">User</div>
              <div role="columnheader">User ID</div>
              <div role="columnheader">Status</div>
              <div role="columnheader">Outcome</div>
              <div role="columnheader">Started</div>
              <div role="columnheader">Finished</div>
            </div>
          </div>

          {rowCount > 0 ? (
            <List
              className="users-table__viewport admin-hover-scrollbar"
              onRowsRendered={handleRowsRendered}
              overscanCount={5}
              role="rowgroup"
              rowComponent={AdminLuckyMeadowUserRow}
              rowCount={rowCount}
              rowHeight={ROW_HEIGHT}
              rowKey={getRowKey}
              rowProps={{
                items,
                loadMoreStatus: isNextPageError ? "error" : "loading",
                onRetryLoadMore,
                startDate
              }}
              tabIndex={0}
            />
          ) : (
            <div role="rowgroup">
              <div className="users-table__empty" role="row">
                <span role="cell">No Lucky Meadow users found</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
