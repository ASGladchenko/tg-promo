import { type ReactNode } from "react";
import { useMe } from "@/entities/me";
import { useTelegramRuntimeStore } from "@/shared/lib/telegram";
import { AuthContext } from "../auth-context";
import "./auth-gate.scss";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const initData = useTelegramRuntimeStore((state) => state.initData);
  const telegramStatus = useTelegramRuntimeStore((state) => state.status);
  const shouldBypassAuth = telegramStatus === "browser";
  const shouldAuthenticate = telegramStatus === "telegram" && Boolean(initData);
  const {
    data: me,
    error,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useMe(initData, {
    enabled: shouldAuthenticate,
  });

  if (shouldBypassAuth) {
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          isAuthLoading: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  if (telegramStatus === "initializing" || (telegramStatus === "telegram" && !initData)) {
    return (
      <section className="auth-gate" aria-label="Авторизация">
        <div className="auth-gate__panel" role="status">
          <span className="auth-gate__spinner" aria-hidden="true" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="auth-gate" aria-label="Ошибка авторизации">
        <div className="auth-gate__panel">
          <p className="auth-gate__message">{error?.message ?? "Не удалось авторизоваться"}</p>
          <button className="auth-gate__retry" type="button" onClick={() => void refetch()}>
            Повторить
          </button>
        </div>
      </section>
    );
  }

  if (isLoading || isFetching || !me) {
    return (
      <section className="auth-gate" aria-label="Авторизация">
        <div className="auth-gate__panel" role="status">
          <span className="auth-gate__spinner" aria-hidden="true" />
        </div>
      </section>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: true,
        isAuthLoading: false,
        me,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
