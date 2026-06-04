import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import QueryProvider from "@/app/providers/query-provider";
import App from "./App";
import "./styles/globals.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
);
