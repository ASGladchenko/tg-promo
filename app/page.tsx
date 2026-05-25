"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type HelloResponse = {
  message: string;
  path: string;
  time: string;
};

type TelegramUser = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone_number?: string;
};

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  sendData: (data: string) => void;
  requestContact: (callback?: (shared: boolean) => void) => void;
  onEvent: (eventType: string, callback: (payload: unknown) => void) => void;
  offEvent: (eventType: string, callback: (payload: unknown) => void) => void;
  platform?: string;
  themeParams?: {
    bg_color?: string;
    text_color?: string;
    button_color?: string;
  };
  initDataUnsafe?: {
    user?: TelegramUser;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export default function Home() {
  const [response, setResponse] = useState("Ответ backend появится здесь.");
  const [isLoading, setIsLoading] = useState(false);
  const [telegramApp, setTelegramApp] = useState<TelegramWebApp | null>(null);
  const [contactStatus, setContactStatus] = useState("Контакт еще не запрошен.");
  const [sharedPhone, setSharedPhone] = useState<string | null>(null);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    webApp.ready();
    webApp.expand();
    setTelegramApp(webApp);

    const theme = webApp.themeParams;
    if (theme?.bg_color) {
      document.documentElement.style.setProperty("--background", theme.bg_color);
    }
    if (theme?.text_color) {
      document.documentElement.style.setProperty("--foreground", theme.text_color);
    }
    if (theme?.button_color) {
      document.documentElement.style.setProperty("--accent", theme.button_color);
    }

    const onContactRequested = (payload: unknown) => {
      const data = payload as {
        status?: "sent" | "cancelled";
        responseUnsafe?: {
          contact?: {
            phone_number?: string;
          };
        };
      };

      if (data.status === "sent") {
        setContactStatus("Пользователь подтвердил отправку контакта.");
      } else if (data.status === "cancelled") {
        setContactStatus("Пользователь отклонил отправку контакта.");
      }

      const phone = data.responseUnsafe?.contact?.phone_number;
      if (phone) {
        setSharedPhone(phone);
      }
    };

    webApp.onEvent("contactRequested", onContactRequested);

    return () => {
      webApp.offEvent("contactRequested", onContactRequested);
    };
  }, []);

  const isTelegram = telegramApp !== null;
  const telegramUserLabel = useMemo(() => {
    const user = telegramApp?.initDataUnsafe?.user;
    if (!user) return "Гость";

    if (user.username) return `@${user.username}`;
    if (user.first_name) return user.first_name;
    return `user:${user.id ?? "unknown"}`;
  }, [telegramApp]);

  const telegramFullName = useMemo(() => {
    const user = telegramApp?.initDataUnsafe?.user;
    if (!user) return "Неизвестно";

    const firstName = user.first_name?.trim() ?? "";
    const lastName = user.last_name?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || "Неизвестно";
  }, [telegramApp]);

  async function askBackend() {
    setIsLoading(true);

    try {
      const res = await fetch("/api/hello", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Backend request failed");
      }

      const data = (await res.json()) as HelloResponse;
      setResponse(`${data.message} Путь: ${data.path}. Время: ${data.time}`);
    } catch {
      setResponse("Не получилось получить ответ от backend.");
    } finally {
      setIsLoading(false);
    }
  }

  function sendResponseToTelegram() {
    if (!telegramApp) {
      setResponse("Telegram WebApp недоступен в обычном браузере.");
      return;
    }

    const payload = {
      type: "hello_response",
      text: response,
      sentAt: new Date().toISOString()
    };

    telegramApp.sendData(JSON.stringify(payload));
    setResponse("Данные отправлены в Telegram-бот.");
  }

  function requestUserContact() {
    if (!telegramApp) {
      setContactStatus("Запрос контакта доступен только в Telegram.");
      return;
    }

    setContactStatus("Ожидаем подтверждение пользователя...");
    telegramApp.requestContact((shared) => {
      if (!shared) {
        setContactStatus("Пользователь отклонил отправку контакта.");
        return;
      }

      setContactStatus("Контакт отправлен боту.");

      const phoneFromInitData = telegramApp.initDataUnsafe?.user?.phone_number;
      if (phoneFromInitData) {
        setSharedPhone(phoneFromInitData);
      }
    });
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <h1 className={styles.title}>Привет</h1>
        <p className={styles.lead}>
          Один и тот же экран работает и как обычный сайт, и как Telegram WebApp.
        </p>
        <p className={styles.meta}>
          Режим: {isTelegram ? `Telegram (${telegramApp?.platform ?? "unknown"})` : "Обычный сайт"}
          {isTelegram ? ` · Пользователь: ${telegramUserLabel}` : ""}
        </p>
        {isTelegram ? <p className={styles.meta}>Имя и фамилия: {telegramFullName}</p> : null}

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
