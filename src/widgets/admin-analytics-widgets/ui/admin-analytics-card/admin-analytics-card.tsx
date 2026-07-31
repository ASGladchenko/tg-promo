import { type ReactNode } from "react";

import { CircularProgressLoader } from "@/shared/ui/circular-progress-loader";

import "./admin-analytics-card.scss";

type AdminAnalyticsCardProps = {
  actions?: ReactNode;
  children?: ReactNode;
  errorMessage?: string;
  isLoading?: boolean;
  meta: string;
  title: string;
  value: string;
};

export function AdminAnalyticsCard({
  actions,
  children,
  errorMessage,
  isLoading = false,
  meta,
  title,
  value
}: AdminAnalyticsCardProps) {
  return (
    <section className="analytics-card" aria-busy={isLoading}>
      <header className="analytics-card__header">
        <div className="analytics-card__summary">
          <h2 className="analytics-card__title">{title}</h2>
          <p className="analytics-card__value">{value}</p>
          <p className="analytics-card__meta">{meta}</p>
        </div>

        {actions ? <div className="analytics-card__actions">{actions}</div> : null}
      </header>

      {isLoading ? (
        <div className="analytics-card__loader">
          <CircularProgressLoader label="Loading analytics" size={34} />
        </div>
      ) : null}

      {errorMessage ? (
        <p className="analytics-card__state analytics-card__state--error" role="alert">
          Failed to load analytics. {errorMessage}
        </p>
      ) : null}

      {children ? <div className="analytics-card__body">{children}</div> : null}
    </section>
  );
}
