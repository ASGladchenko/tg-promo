"use client";

import {
  init,
  isTMA,
  miniApp,
  viewport,
  sendData,
  requestContact,
  retrieveRawInitData,
  retrieveLaunchParams,
} from "@tma.js/sdk-react";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

type HelloResponse = {
  message: string;
  path: string;
  time: string;
  telegramVerified: boolean;
};

type ApiErrorResponse = {
  error?: string;
};

type ChannelMembershipResponse = {
  subscribed: boolean;
  status: string;
};

type SessionUser = {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
};

type AuthSessionResponse = {
  authenticated: boolean;
  user?: SessionUser;
  source?: "miniapp" | "widget";
};

type TelegramWidgetUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

type TelegramUser = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone_number?: string;
};

let sdkInitState: "idle" | "ready" | "failed" = "idle";
const SHARE_TEXT = "Привет! заходи к нам я начал бой.";
const SHARE_GAME_URL = process.env.NEXT_PUBLIC_TELEGRAM_SHARE_URL?.trim();
const CHANNEL_URL = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL?.trim();
const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim();

type TelegramWebAppGlobal = {
  WebApp?: {
    openTelegramLink?: (url: string) => void;
  };
};

declare global {
  interface Window {
    Telegram?: TelegramWebAppGlobal;
    onTelegramAuth?: (user: TelegramWidgetUser) => void;
  }
}

function ensureSdkInitialized(): boolean {
  if (sdkInitState === "ready") {
    return true;
  }
  if (sdkInitState === "failed") {
    return false;
  }

  try {
    init();
    sdkInitState = "ready";
    return true;
  } catch {
    sdkInitState = "failed";
    return false;
  }
}

export default function Home() {
  const [response, setResponse] = useState("Ответ backend появится здесь.");
  const [isLoading, setIsLoading] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);
  const [rawInitData, setRawInitData] = useState<string | undefined>(undefined);
  const [telegramPlatform, setTelegramPlatform] = useState("unknown");
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [contactStatus, setContactStatus] = useState("Контакт еще не запрошен.");
  const [sharedPhone, setSharedPhone] = useState<string | null>(null);
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);
  const [authUser, setAuthUser] = useState<SessionUser | null>(null);
  const [authSource, setAuthSource] = useState<"miniapp" | "widget" | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthInProgress, setIsAuthInProgress] = useState(false);
  const miniAppAuthAttemptedRef = useRef(false);

  useEffect(() => {
    if (!ensureSdkInitialized()) {
      return;
    }

    if (!isTMA()) {
      return;
    }

    setIsTelegram(true);

    try {
      const launchParams = retrieveLaunchParams();
      setTelegramPlatform(launchParams.tgWebAppPlatform ?? "unknown");
      setRawInitData(retrieveRawInitData());

      const user = launchParams.tgWebAppData?.user;
      if (user) {
        setTelegramUser(user as TelegramUser);
      }

      const theme = launchParams.tgWebAppThemeParams;
      if (theme?.bg_color) {
        document.documentElement.style.setProperty("--background", theme.bg_color);
      }
      if (theme?.text_color) {
        document.documentElement.style.setProperty("--foreground", theme.text_color);
      }
      if (theme?.button_color) {
        document.documentElement.style.setProperty("--accent", theme.button_color);
      }
    } catch {
      setTelegramPlatform("unknown");
    }

    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
    }

    if (miniApp.ready.isAvailable()) {
      miniApp.ready();
    }

    if (viewport.mount.isAvailable()) {
      void viewport.mount().catch(() => undefined);
    }

    if (viewport.expand.isAvailable()) {
      viewport.expand();
    }
  }, []);

  useEffect(() => {
    void restoreSession().finally(() => {
      setIsAuthLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isTelegram || !rawInitData || authUser || miniAppAuthAttemptedRef.current) {
      return;
    }

    miniAppAuthAttemptedRef.current = true;
    void authenticateMiniApp(rawInitData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTelegram, rawInitData, authUser]);

  useEffect(() => {
    window.onTelegramAuth = (user: TelegramWidgetUser) => {
      void authenticateTelegramWidget(user);
    };

    return () => {
      delete window.onTelegramAuth;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isTelegram || authUser || !TELEGRAM_BOT_USERNAME) {
      return;
    }

    const container = document.getElementById("telegram-login-widget");
    if (!container) {
      return;
    }

    container.innerHTML = "";
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", TELEGRAM_BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "10");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [authUser, isTelegram]);

  const telegramUserLabel = useMemo(() => {
    if (!telegramUser) return "Гость";

    if (telegramUser.username) return `@${telegramUser.username}`;
    if (telegramUser.first_name) return telegramUser.first_name;
    return `user:${telegramUser.id ?? "unknown"}`;
  }, [telegramUser]);

  const telegramFullName = useMemo(() => {
    if (!telegramUser) return "Неизвестно";

    const firstName = telegramUser.first_name?.trim() ?? "";
    const lastName = telegramUser.last_name?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || "Неизвестно";
  }, [telegramUser]);

  const authUserLabel = useMemo(() => {
    if (!authUser) return "Не авторизован";
    return authUser.username ? `@${authUser.username}` : `${authUser.firstName}${authUser.lastName ? ` ${authUser.lastName}` : ""}`;
  }, [authUser]);

  async function restoreSession() {
    try {
      const res = await fetch("/api/auth/session", {
        cache: "no-store"
      });
      if (!res.ok) {
        return;
      }

      const data = (await res.json()) as AuthSessionResponse;
      if (!data.authenticated || !data.user) {
        return;
      }

      setAuthUser(data.user);
      setAuthSource(data.source ?? null);
    } catch {
      // No-op: app can still work without a restored session.
    }
  }

  async function authenticateMiniApp(rawInit: string) {
    setIsAuthInProgress(true);

    try {
      const res = await fetch("/api/auth/miniapp", {
        method: "POST",
        cache: "no-store",
        headers: {
          "x-telegram-init-data": rawInit
        }
      });

      if (!res.ok) {
        const errorBody = (await res.json().catch(() => null)) as ApiErrorResponse | null;
        throw new Error(errorBody?.error ?? "Mini App auth failed.");
      }

      const data = (await res.json()) as {
        ok: boolean;
        user: SessionUser;
        source: "miniapp";
      };

      if (data.ok) {
        setAuthUser(data.user);
        setAuthSource(data.source);
      }
    } catch (error) {
      if (error instanceof Error) {
        setResponse(`Не удалось авторизоваться в Mini App. ${error.message}`);
      } else {
        setResponse("Не удалось авторизоваться в Mini App.");
      }
    } finally {
      setIsAuthInProgress(false);
    }
  }

  async function authenticateTelegramWidget(user: TelegramWidgetUser) {
    setIsAuthInProgress(true);

    try {
      const res = await fetch("/api/auth/telegram-widget", {
        method: "POST",
        cache: "no-store",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(user)
      });

      if (!res.ok) {
        const errorBody = (await res.json().catch(() => null)) as ApiErrorResponse | null;
        throw new Error(errorBody?.error ?? "Telegram Login auth failed.");
      }

      const data = (await res.json()) as {
        ok: boolean;
        user: SessionUser;
        source: "widget";
      };

      if (data.ok) {
        setAuthUser(data.user);
        setAuthSource(data.source);
        setResponse("Вы успешно вошли через Telegram.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setResponse(`Ошибка Telegram входа. ${error.message}`);
      } else {
        setResponse("Ошибка Telegram входа.");
      }
    } finally {
      setIsAuthInProgress(false);
    }
  }

  async function logoutSession() {
    setIsAuthInProgress(true);

    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
        cache: "no-store"
      });
      setAuthUser(null);
      setAuthSource(null);
      setResponse("Сессия очищена.");
    } finally {
      setIsAuthInProgress(false);
    }
  }

  async function askBackend() {
    setIsLoading(true);

    try {
      const headers = rawInitData
        ? {
            "x-telegram-init-data": rawInitData
          }
        : undefined;

      const res = await fetch("/api/hello", {
        cache: "no-store",
        headers
      });

      if (!res.ok) {
        const errorBody = (await res.json().catch(() => null)) as ApiErrorResponse | null;
        throw new Error(errorBody?.error ?? "Backend request failed");
      }

      const data = (await res.json()) as HelloResponse;
      const validationStatus = data.telegramVerified ? "Проверка Telegram: пройдена." : "Проверка Telegram: нет (обычный веб-режим).";
      setResponse(`${data.message} Путь: ${data.path}. Время: ${data.time}. ${validationStatus}`);
    } catch (error) {
      if (error instanceof Error) {
        setResponse(`Не получилось получить ответ от backend. ${error.message}`);
      } else {
        setResponse("Не получилось получить ответ от backend.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function sendResponseToTelegram() {
    if (!isTelegram || !sendData.isAvailable()) {
      setResponse("Telegram WebApp недоступен в обычном браузере.");
      return;
    }

    const payload = {
      type: "hello_response",
      text: response,
      sentAt: new Date().toISOString()
    };

    try {
      sendData(JSON.stringify(payload));
      setResponse("Данные отправлены в Telegram-бот.");
    } catch {
      setResponse("Не удалось отправить данные в Telegram-бот.");
    }
  }

  async function requestUserContact() {
    if (!isTelegram || !requestContact.isAvailable()) {
      setContactStatus("Запрос контакта доступен только в Telegram.");
      return;
    }

    setContactStatus("Ожидаем подтверждение пользователя...");

    try {
      const contact = await requestContact();

      if (!contact?.contact?.phone_number) {
        setContactStatus("Контакт не был предоставлен пользователем.");
        return;
      }

      setSharedPhone(contact.contact.phone_number);
      setContactStatus("Контакт отправлен боту.");
    } catch {
      setContactStatus("Пользователь отклонил отправку контакта или произошла ошибка.");
    }
  }

  function shareInviteInTelegram() {
    if (!SHARE_GAME_URL) {
      setResponse(
        "Не настроена ссылка на игру. Добавь NEXT_PUBLIC_TELEGRAM_SHARE_URL в .env.local и перезапусти приложение."
      );
      return;
    }

    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(SHARE_GAME_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`;

    try {
      if (isTelegram && window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(shareUrl);
        return;
      }

      window.open(shareUrl, "_blank", "noopener,noreferrer");
    } catch {
      setResponse("Не удалось открыть окно шаринга в Telegram.");
    }
  }

  function openChannelForSubscribe() {
    if (!CHANNEL_URL) {
      setResponse("Не настроена ссылка на канал. Добавь NEXT_PUBLIC_TELEGRAM_CHANNEL_URL в .env.local.");
      return;
    }

    try {
      if (isTelegram && window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(CHANNEL_URL);
        return;
      }

      window.open(CHANNEL_URL, "_blank", "noopener,noreferrer");
    } catch {
      setResponse("Не удалось открыть ссылку на канал.");
    }
  }

  async function checkChannelMembership() {
    if (!authUser && !rawInitData) {
      setResponse("Сначала войдите через Telegram, потом проверьте подписку.");
      return;
    }

    setIsCheckingMembership(true);

    try {
      const res = await fetch("/api/channel-membership", {
        cache: "no-store",
        headers: rawInitData
          ? {
              "x-telegram-init-data": rawInitData
            }
          : undefined
      });

      if (!res.ok) {
        const errorBody = (await res.json().catch(() => null)) as ApiErrorResponse | null;
        throw new Error(errorBody?.error ?? "Не удалось проверить подписку.");
      }

      const data = (await res.json()) as ChannelMembershipResponse;
      if (data.subscribed) {
        setResponse("Подписка подтверждена ✅");
        return;
      }

      setResponse(`Подписка не найдена. Текущий статус: ${data.status}.`);
    } catch (error) {
      if (error instanceof Error) {
        setResponse(`Ошибка проверки подписки. ${error.message}`);
      } else {
        setResponse("Ошибка проверки подписки.");
      }
    } finally {
      setIsCheckingMembership(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <h1 className={styles.title}>Привет</h1>
        <p className={styles.lead}>
          Один и тот же экран работает и как обычный сайт, и как Telegram WebApp.
        </p>
        <p className={styles.meta}>
          Режим: {isTelegram ? `Telegram (${telegramPlatform})` : "Обычный сайт"}
          {isTelegram ? ` · Пользователь: ${telegramUserLabel}` : ""}
        </p>
        {isTelegram ? <p className={styles.meta}>Имя и фамилия: {telegramFullName}</p> : null}
        <p className={styles.meta}>
          Авторизация: {isAuthLoading ? "Проверяем сессию..." : authUser ? `${authUserLabel} (${authSource})` : "Не выполнена"}
        </p>
        {!isTelegram && !authUser && !isAuthLoading ? (
          TELEGRAM_BOT_USERNAME ? (
            <div id="telegram-login-widget" />
          ) : (
            <p className={styles.meta}>
              Для входа на сайте укажи `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` в `.env.local`.
            </p>
          )
        ) : null}

        <div className={styles.panel}>
          <div className={styles.actions}>
            <button className={styles.button} disabled={isLoading} onClick={askBackend}>
              {isLoading ? "Запрашиваю..." : "Спросить backend"}
            </button>
            {isTelegram ? (
              <button className={styles.secondaryButton} onClick={sendResponseToTelegram}>
                Отправить ответ в Telegram
              </button>
            ) : null}
            {isTelegram ? (
              <button className={styles.secondaryButton} onClick={requestUserContact}>
                Запросить контакт
              </button>
            ) : null}
            <button className={styles.secondaryButton} onClick={shareInviteInTelegram}>
              Поделиться в Telegram
            </button>
            <button className={styles.secondaryButton} onClick={openChannelForSubscribe}>
              Подписаться на канал
            </button>
            <button className={styles.secondaryButton} disabled={isCheckingMembership} onClick={checkChannelMembership}>
              {isCheckingMembership ? "Проверяю подписку..." : "Проверить подписку"}
            </button>
            {authUser ? (
              <button className={styles.secondaryButton} disabled={isAuthInProgress} onClick={logoutSession}>
                Выйти
              </button>
            ) : null}
          </div>
          <p className={styles.response}>{response}</p>
          <p className={styles.response}>
            {sharedPhone
              ? `Контакт пользователя: ${sharedPhone}`
              : `${contactStatus} ${
                  isTelegram ? "Номер обычно приходит на стороне бота, не во фронт Mini App." : ""
                }`}
          </p>
        </div>
      </section>
    </main>
  );
}
