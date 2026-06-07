import { PUBLIC_ENV } from "@/shared/config";
import { type SupportedLocale, translationResources } from "./resources";

export { SUPPORTED_LOCALES, type SupportedLocale } from "./resources";

const SAFE_FALLBACK_LOCALE: SupportedLocale = "ar";
const LOCALE_STORAGE_KEY = "tg-promo.locale";

export function getSupportedLocale(value: string | undefined): SupportedLocale | undefined {
  const language = value?.trim().replaceAll("_", "-").split("-")[0]?.toLowerCase();

  return language && Object.hasOwn(translationResources, language)
    ? (language as SupportedLocale)
    : undefined;
}

export function getDefaultLocale(): SupportedLocale {
  return getSupportedLocale(PUBLIC_ENV.DEFAULT_LOCALE) ?? SAFE_FALLBACK_LOCALE;
}

export function getStoredLocale(): SupportedLocale | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const locale = getSupportedLocale(storedLocale ?? undefined);

    if (!locale && storedLocale !== null) {
      window.localStorage.removeItem(LOCALE_STORAGE_KEY);
    }

    return locale;
  } catch {
    return undefined;
  }
}

export function storeLocale(locale: SupportedLocale): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Language switching still works when storage is unavailable.
  }
}

export function resolveTelegramLocale(languageCode: string | undefined): SupportedLocale {
  return getStoredLocale() ?? getSupportedLocale(languageCode) ?? getDefaultLocale();
}

export function resolveBrowserLocale(languages: readonly string[]): SupportedLocale {
  const storedLocale = getStoredLocale();

  if (storedLocale) {
    return storedLocale;
  }

  for (const language of languages) {
    const locale = getSupportedLocale(language);

    if (locale) {
      return locale;
    }
  }

  return getDefaultLocale();
}

export function getBrowserLanguages(): string[] {
  if (typeof navigator === "undefined") {
    return [];
  }

  return [...navigator.languages, navigator.language];
}
