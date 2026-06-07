import { PUBLIC_ENV } from "@/shared/config";
import { type SupportedLocale, translationResources } from "./resources";

export { SUPPORTED_LOCALES, type SupportedLocale } from "./resources";

const SAFE_FALLBACK_LOCALE: SupportedLocale = "ar";

export function getSupportedLocale(value: string | undefined): SupportedLocale | undefined {
  const language = value?.trim().replaceAll("_", "-").split("-")[0]?.toLowerCase();

  return language && Object.hasOwn(translationResources, language)
    ? (language as SupportedLocale)
    : undefined;
}

export function getDefaultLocale(): SupportedLocale {
  return getSupportedLocale(PUBLIC_ENV.DEFAULT_LOCALE) ?? SAFE_FALLBACK_LOCALE;
}

export function resolveTelegramLocale(languageCode: string | undefined): SupportedLocale {
  return getSupportedLocale(languageCode) ?? getDefaultLocale();
}

export function resolveBrowserLocale(languages: readonly string[]): SupportedLocale {
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
