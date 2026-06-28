import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { App } from "@/app";
import { I18nProvider } from "@/app/providers/i18n-provider";
import { QueryProvider } from "@/app/providers/query-provider";
import { ToastNotifications } from "@/shared/ui/toast-notifications";

import "./styles/globals.scss";

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <QueryProvider>
          <App />
          <ToastNotifications />
        </QueryProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);

// createRoot(root).render(
//   <StrictMode>
//     <I18nProvider>
//       <QueryProvider>
//         <App />
//         <ToastNotifications />
//       </QueryProvider>
//     </I18nProvider>
//   </StrictMode>
// );
