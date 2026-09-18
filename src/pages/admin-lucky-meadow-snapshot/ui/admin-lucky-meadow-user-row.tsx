import clsx from "clsx";
import { type RowComponentProps } from "react-window";
import { generatePath, Link } from "react-router";

import { type LuckyMeadowPeriodUser } from "@/entities/lucky-meadow";
import { APP_ROUTES } from "@/shared/config";

import "./admin-lucky-meadow-user-row.scss";

export type AdminLuckyMeadowUserRowData = {
  items: readonly LuckyMeadowPeriodUser[];
  loadMoreStatus: "error" | "loading";
  onRetryLoadMore: () => void;
  startDate: string;
};

const statusLabels: Record<LuckyMeadowPeriodUser["status"], string> = {
  active: "Active",
  finished: "Finished",
  refund_pending: "Refund pending",
  refunded: "Refunded"
};

const statusClasses: Record<LuckyMeadowPeriodUser["status"], string> = {
  active: "user-row__status--active",
  finished: "user-row__status--finished",
  refund_pending: "user-row__status--pending",
  refunded: "user-row__status--refunded"
};

const outcomeLabels: Record<NonNullable<LuckyMeadowPeriodUser["finalOutcome"]>, string> = {
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

function getUserLabel(user: LuckyMeadowPeriodUser) {
  const fullName = [user.name, user.surname].filter(Boolean).join(" ").trim();
  const name = fullName || user.login || "Unnamed user";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    details: fullName && user.login ? `@${user.login}` : null,
    initials,
    name
  };
}

export function AdminLuckyMeadowUserRow({
  ariaAttributes,
  index,
  items,
  loadMoreStatus,
  onRetryLoadMore,
  startDate,
  style
}: RowComponentProps<AdminLuckyMeadowUserRowData>) {
  const user = items[index];

  if (!user) {
    return (
      <div {...ariaAttributes} className="user-row user-row--load-more" role="row" style={style}>
        <div className="user-row__load-more" role="cell">
          {loadMoreStatus === "error" ? (
            <button className="user-row__retry" onClick={onRetryLoadMore} type="button">
              Retry loading users
            </button>
          ) : (
            <span aria-live="polite">Loading more users...</span>
          )}
        </div>
      </div>
    );
  }

  const userLabel = getUserLabel(user);
  const sessionsPath = `${APP_ROUTES.admin}/${generatePath(APP_ROUTES.adminLuckyMeadowUserSessions, {
    id: user.userId,
    startDate
  })}`;

  return (
    <div {...ariaAttributes} className="user-row" role="row" style={style}>
      <Link
        aria-label={`View Lucky Meadow sessions for ${userLabel.name}`}
        className="user-row__link"
        to={sessionsPath}
      />

      <div className="user-row__cell user-row__user" role="cell">
        <span className="user-row__avatar" aria-hidden="true">
          {user.imgUrl ? <img src={user.imgUrl} alt="" /> : userLabel.initials}
        </span>
        <span className="user-row__identity">
          <strong title={userLabel.name}>{userLabel.name}</strong>
          {userLabel.details ? <small title={userLabel.details}>{userLabel.details}</small> : null}
        </span>
      </div>

      <code className="user-row__cell user-row__id" role="cell" title={user.userId}>
        {user.userId}
      </code>

      <div className="user-row__cell" role="cell">
        <span className={clsx("user-row__status", statusClasses[user.status])}>
          {statusLabels[user.status]}
        </span>
      </div>

      <div className="user-row__cell" role="cell">
        {user.finalOutcome ? outcomeLabels[user.finalOutcome] : "—"}
      </div>

      <time className="user-row__cell" dateTime={user.startedAt} role="cell">
        {formatDate(user.startedAt)}
      </time>

      <time className="user-row__cell" dateTime={user.finishedAt ?? undefined} role="cell">
        {formatDate(user.finishedAt)}
      </time>
    </div>
  );
}
