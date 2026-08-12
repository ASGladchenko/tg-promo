import { APP_ROUTES } from "@/shared/config";

export type AdminSidebarLinkItem = {
  end?: boolean;
  title: string;
  to: string;
};
export type AdminSidebarGroupItem = {
  basePath: string;
  children: AdminSidebarLinkItem[];
  title: string;
};
export type AdminSidebarItem = AdminSidebarGroupItem | AdminSidebarLinkItem;

export const adminSidebarItems: AdminSidebarItem[] = [
  {
    title: "Dashboard",
    to: APP_ROUTES.admin,
    end: true
  },
  {
    title: "Prizes",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminPrizes}`,
    end: true
  },
  {
    title: "Schedule",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminSchedule}`,
    end: true
  },
  {
    title: "Consolation",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminConsolation}`,
    end: true
  },
  {
    title: "Settings",
    basePath: `${APP_ROUTES.admin}/${APP_ROUTES.adminSettings}`,
    children: [
      {
        title: "General",
        to: `${APP_ROUTES.admin}/${APP_ROUTES.adminSettings}`,
        end: true
      },
      {
        title: "AI settings",
        to: `${APP_ROUTES.admin}/${APP_ROUTES.adminSettingsAi}`,
        end: true
      }
    ]
  }
];
