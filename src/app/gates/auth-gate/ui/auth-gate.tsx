import { type ReactNode } from "react";

import { useTranslation } from "react-i18next";

import { useAuthenticateDevViewer, useAuthenticateViewer } from "@/features/authenticate-viewer";
import { useTelegramRuntimeStore } from "@/shared/lib/telegram";

import "./auth-gate.scss";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const { t } = useTranslation();
  const initData = useTelegramRuntimeStore((state) => state.initData);
  const telegramStatus = useTelegramRuntimeStore((state) => state.status);
  const shouldAuthenticateWithTelegram = telegramStatus === "telegram" && Boolean(initData);
  const shouldAuthenticateWithDevLogin = telegramStatus === "browser" && import.meta.env.DEV;
  const telegramAuthentication = useAuthenticateViewer(initData, {
    enabled: shouldAuthenticateWithTelegram
  });

  const devAuthentication = useAuthenticateDevViewer({
    enabled: shouldAuthenticateWithDevLogin
  });
  const {
    data: me,
    isError,
    isLoading,
    isFetching,
    error,
    refetch
  } = shouldAuthenticateWithDevLogin ? devAuthentication : telegramAuthentication;

  if (telegramStatus === "initializing" || (telegramStatus === "telegram" && !initData)) {
    return (
      <section className="auth-gate" aria-label={t("auth.loadingLabel")}>
        <div className="auth-gate__panel" role="status">
          <span className="auth-gate__spinner" aria-hidden="true" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="auth-gate" aria-label={t("auth.errorLabel")}>
        <div className="auth-gate__panel" role="alert">
          <p className="auth-gate__message">{t("auth.errorMessage")}</p>
          <p className="auth-gate__message">{error.message}</p>
          <button className="auth-gate__retry" type="button" onClick={() => void refetch()}>
            {t("auth.retry")}
          </button>
        </div>
      </section>
    );
  }

  if (isLoading || isFetching || !me) {
    return (
      <section className="auth-gate" aria-label={t("auth.loadingLabel")}>
        <div className="auth-gate__panel" role="status">
          <span className="auth-gate__spinner" aria-hidden="true" />
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
