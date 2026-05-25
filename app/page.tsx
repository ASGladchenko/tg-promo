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
  username?: string;
};

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  sendData: (data: string) => void;
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
  }, []);

  const isTelegram = telegramApp !== null;
  const telegramUserLabel = useMemo(() => {
    const user = telegramApp?.initDataUnsafe?.user;
    if (!user) return "Гость";

    if (user.username) return `@${user.username}`;
    if (user.first_name) return user.first_name;
    return `user:${user.id ?? "unknown"}`;
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
          </div>
          <p className={styles.response}>{response}</p>
        </div>
      </section>
    </main>
  );
}
