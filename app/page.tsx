"use client";

import {
  init,
  isTMA,
  miniApp,
  requestContact,
  retrieveRawInitData,
  retrieveLaunchParams,
  sendData,
  viewport
} from "@tma.js/sdk-react";
import { useEffect, useMemo, useState } from "react";
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

type TelegramWebAppGlobal = {
  WebApp?: {
    openTelegramLink?: (url: string) => void;
  };
};

declare global {
  interface Window {
    Telegram?: TelegramWebAppGlobal;
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
