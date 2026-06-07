import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getDefaultLocale, type SupportedLocale } from "./locale";
import { translationResources } from "./resources";

export const i18n = i18next.createInstance();
const defaultLocale = getDefaultLocale();

void i18n.use(initReactI18next).init({
  initAsync: false,
  resources: translationResources,
  lng: defaultLocale,
  fallbackLng: defaultLocale,
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

applyDocumentLocale(defaultLocale);

export async function applyLocale(locale: SupportedLocale): Promise<void> {
  await i18n.changeLanguage(locale);
  applyDocumentLocale(locale);
}
