import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { getDefaultLocale, getStoredLocale, type SupportedLocale } from "./locale";
import { translationResources } from "./resources";

export const i18n = i18next.createInstance();

const fallbackLocale = getDefaultLocale();

const initialLocale = getStoredLocale() ?? fallbackLocale;

void i18n.use(initReactI18next).init({
  initAsync: false,
  resources: translationResources,
  lng: initialLocale,
  fallbackLng: fallbackLocale,
  supportedLngs: Object.keys(translationResources),
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

function applyDocumentLocale(locale: SupportedLocale): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = locale;
  document.documentElement.dir = i18n.dir(locale);
}

applyDocumentLocale(initialLocale);

export async function applyLocale(locale: SupportedLocale): Promise<void> {
  await i18n.changeLanguage(locale);
  applyDocumentLocale(locale);
}
