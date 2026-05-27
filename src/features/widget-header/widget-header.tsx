"use client";

import Logo from "@/src/shared/ui/logo/logo";

type WidgetHeaderProps = {
  siteUrl: string;
};

export default function WidgetHeader({ siteUrl }: WidgetHeaderProps) {
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
      <Logo as="button" onClick={openSiteInBrowser} ariaLabel="Open 1mlnbet.com" />
    </header>
  );
}
