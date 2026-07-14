import { APP_ROUTES } from "@/shared/config";

export const adminSidebarItems = [
  {
    title: "Prizes",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminPrizes}`,
    end: true
  },
  {
    title: "Crack Safe Rules",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminCrackSafeRules}`,
    end: true
  },
  {
    title: "Consolation",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminConsolation}`,
    end: true
  }
] as const;
