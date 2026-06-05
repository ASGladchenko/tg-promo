function readString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

const telegramBotUsername = readString(import.meta.env.VITE_TELEGRAM_BOT_USERNAME);
const telegramShareUrl = readString(import.meta.env.VITE_TELEGRAM_SHARE_URL);

export const PUBLIC_ENV = {
  API_BASE_URL: readString(import.meta.env.VITE_API_BASE_URL),
  TELEGRAM_BOT_USERNAME: telegramBotUsername,
  TELEGRAM_CHANNEL_URL: readString(import.meta.env.VITE_TELEGRAM_CHANNEL_URL),
  TELEGRAM_SHARE_URL: telegramShareUrl ?? "",
  BRAND_SITE_URL: readString(import.meta.env.VITE_BRAND_SITE_URL) ?? ""
} as const;
