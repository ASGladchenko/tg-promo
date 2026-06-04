import { createContext, type ReactNode, useContext } from "react";
import { type Me, useMe } from "@/entities/me";
import "./auth-gate.scss";

type AuthContextValue = {
  initData?: string;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isTelegram: boolean;
  me?: Me;
};

type AuthGateProps = {
  children: ReactNode;
  initData?: string;
  isTelegram: boolean;
  isTelegramReady: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used inside AuthGate");
  }

  return auth;
}

export default function AuthGate({ children, initData, isTelegram, isTelegramReady }: AuthGateProps) {
  const shouldBypassAuth = isTelegramReady && !isTelegram;
  const shouldAuthenticate = isTelegramReady && isTelegram && Boolean(initData);
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
          initData,
          isAuthenticated: false,
          isAuthLoading: false,
          isTelegram,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  if (!isTelegramReady || (isTelegram && !initData)) {
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
        initData,
        isAuthenticated: true,
        isAuthLoading: false,
        isTelegram,
        me,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
