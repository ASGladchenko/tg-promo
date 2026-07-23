/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_BRAND_SITE_URL?: string;
  readonly VITE_DEFAULT_LOCALE?: string;
  readonly VITE_TELEGRAM_BOT_USERNAME?: string;
  readonly VITE_TELEGRAM_CHANNEL_URL?: string;
  readonly VITE_TELEGRAM_SHARE_URL?: string;
  readonly VITE_WS_BASE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
