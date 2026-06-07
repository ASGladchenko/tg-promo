import { arTranslation } from "./locales/ar";
import { enTranslation } from "./locales/en";
import { frTranslation } from "./locales/fr";

export const translationResources = {
  ar: {
    translation: arTranslation
  },
  en: {
    translation: enTranslation
  },
  fr: {
    translation: frTranslation
  }
} as const;

export type SupportedLocale = keyof typeof translationResources;

export const SUPPORTED_LOCALES = Object.keys(translationResources) as SupportedLocale[];
