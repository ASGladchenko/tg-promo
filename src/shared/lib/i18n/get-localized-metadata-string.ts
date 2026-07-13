import { getSupportedLocale, type SupportedLocale } from "./locale";

const FALLBACK_LOCALES: SupportedLocale[] = ["ar", "en"];

function getOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function getMetadataSource(value: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  return getRecord(value?.metadata) ?? value;
}

export function getLocalizedMetadataString(
  metadata: Record<string, unknown> | undefined,
  locale: string | undefined,
  fallback?: unknown
): string | null {
  const metadataSource = getMetadataSource(metadata);
  const supportedLocale = getSupportedLocale(locale);
  const locales = supportedLocale
    ? [supportedLocale, ...FALLBACK_LOCALES.filter((fallbackLocale) => fallbackLocale !== supportedLocale)]
    : FALLBACK_LOCALES;

  for (const metadataLocale of locales) {
    const value = getOptionalString(metadataSource?.[metadataLocale]);

    if (value) {
      return value;
    }
  }

  return getOptionalString(fallback);
}
