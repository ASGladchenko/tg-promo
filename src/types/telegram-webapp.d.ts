type TelegramWebAppApi = {
  initDataUnsafe?: {
    user?: {
      language_code?: string;
    };
  };
  openLink?: (url: string, options?: { try_browser?: string }) => void;
  openTelegramLink?: (url: string) => void;
};

type TelegramGlobal = {
  WebApp?: TelegramWebAppApi;
};

declare global {
  interface Window {
    Telegram?: TelegramGlobal;
  }
}

export {};
