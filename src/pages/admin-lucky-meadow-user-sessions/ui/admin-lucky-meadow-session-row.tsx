import clsx from "clsx";
import { type RowComponentProps } from "react-window";

import { type LuckyMeadowUserSession } from "@/entities/lucky-meadow";

import "./admin-lucky-meadow-session-row.scss";

export type AdminLuckyMeadowSessionRowData = {
  items: readonly LuckyMeadowUserSession[];
  loadMoreStatus: "error" | "loading";
  onOpenSession: (userSnapshotId: string) => void;
  onRetryLoadMore: () => void;
};

const statusLabels: Record<LuckyMeadowUserSession["status"], string> = {
  active: "Active",
  finished: "Finished",
  refund_pending: "Refund pending",
  refunded: "Refunded"
};

const statusClasses: Record<LuckyMeadowUserSession["status"], string> = {
  active: "session-row__status--active",
  finished: "session-row__status--finished",
  refund_pending: "session-row__status--pending",
  refunded: "session-row__status--refunded"
};

const outcomeLabels: Record<NonNullable<LuckyMeadowUserSession["finalOutcome"]>, string> = {
  game_over: "Game over",
  jackpot: "Jackpot",
  refunded: "Refunded",
  semi_jackpot: "Lucky Prize"
};

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function AdminLuckyMeadowSessionRow({
  ariaAttributes,
  index,
  items,
  loadMoreStatus,
  onOpenSession,
  onRetryLoadMore,
  style
}: RowComponentProps<AdminLuckyMeadowSessionRowData>) {
  const session = items[index];

  if (!session) {
    return (
      <div {...ariaAttributes} className="session-row session-row--load-more" style={style}>
        {loadMoreStatus === "error" ? (
          <button className="session-row__retry" onClick={onRetryLoadMore} type="button">
            Retry loading sessions
          </button>
        ) : (
          <span aria-live="polite">Loading more sessions...</span>
        )}
      </div>
    );
  }

  const outcome = session.finalOutcome ? outcomeLabels[session.finalOutcome] : "—";

  return (
    <div {...ariaAttributes} className="session-row" style={style}>
      <button
        aria-label={`View session ${session.userSnapshotId} field`}
        className="session-row__button"
        onClick={() => onOpenSession(session.userSnapshotId)}
        type="button"
      >
        <code className="session-row__cell session-row__id" title={session.userSnapshotId}>
          {session.userSnapshotId}
        </code>
        <span className="session-row__cell">
          <span className={clsx("session-row__status", statusClasses[session.status])}>
            {statusLabels[session.status]}
          </span>
        </span>
        <span className="session-row__cell">{outcome}</span>
        <span className="session-row__cell">
          {session.jackpotCount} / {session.semiJackpotCount}
        </span>
        <span className="session-row__cell">{session.semiJackpotConsumed ? "Consumed" : "Not consumed"}</span>
        <time className="session-row__cell" dateTime={session.startedAt}>
          {formatDate(session.startedAt)}
        </time>
        <time className="session-row__cell" dateTime={session.finishedAt ?? undefined}>
          {formatDate(session.finishedAt)}
        </time>
      </button>
    </div>
  );
}
