import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { App } from "@/app";
import { I18nProvider } from "@/app/providers/i18n-provider";
import { QueryProvider } from "@/app/providers/query-provider";
import { ToastNotifications } from "@/shared/ui/toast-notifications";

import "./styles/globals.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <QueryProvider>
        <App />
        <ToastNotifications />
      </QueryProvider>
    </I18nProvider>
  </StrictMode>
);
