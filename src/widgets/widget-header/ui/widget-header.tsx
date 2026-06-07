import { useTranslation } from "react-i18next";
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
      <Logo as="button" onClick={openSiteInBrowser} ariaLabel={t("brand.logoLabel")} />
    </header>
  );
}
