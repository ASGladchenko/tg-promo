type TelegramWebAppApi = {
  HapticFeedback?: {
    impactOccurred?: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred?: (type: "error" | "success" | "warning") => void;
    selectionChanged?: () => void;
  };
  initDataUnsafe?: {
    user?: {
      language_code?: string;
    };
  };
  openLink?: (
    url: string,
    options?: {
      try_browser?: string;
    }
  ) => void;
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
