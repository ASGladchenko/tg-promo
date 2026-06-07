import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/shared/ui/language-switcher";
import { Logo } from "@/shared/ui/logo";
import "./widget-header.scss";

type WidgetHeaderProps = {
  siteUrl: string;
};

export function WidgetHeader({ siteUrl }: WidgetHeaderProps) {
  const { t } = useTranslation();

  function openSiteInBrowser() {
    if (typeof window === "undefined") {
      return;
    }

    if (window.Telegram?.WebApp?.openLink) {
      window.Telegram.WebApp.openLink(siteUrl, { try_browser: "chrome" });
      return;
    }

    window.open(siteUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <header className="widget-header">
      <span className="widget-header__balance" aria-hidden="true" />
      <Logo
        className="widget-header__logo"
        as="button"
        onClick={openSiteInBrowser}
        ariaLabel={t("brand.logoLabel")}
      />
      <LanguageSwitcher />
    </header>
  );
}
