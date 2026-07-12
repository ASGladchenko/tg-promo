import { APP_ROUTES } from "@/shared/config";

export const adminSidebarItems = [
  {
    title: "Prizes",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminPrizes}`,
    end: true
  },
  {
    title: "Rules",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminRules}`,
    end: true
  },
  {
    title: "Consolation",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminConsolation}`,
    end: true
  }
] as const;
