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
    title: "Prizes",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminPrizes}`,
    end: true
  },
  {
    title: "Crack Safe",
    basePath: `${APP_ROUTES.admin}/${APP_ROUTES.adminCrackSafe}`,
    children: [
      {
        title: "Rules",
        to: `${APP_ROUTES.admin}/${APP_ROUTES.adminCrackSafeRules}`,
        end: true
      },
      {
        title: "Snapshots",
        to: `${APP_ROUTES.admin}/${APP_ROUTES.adminCrackSafeSnapshots}`,
        end: false
      }
    ]
  },
  {
    title: "Consolation",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminConsolation}`,
    end: true
  },
  {
    title: "Settings",
    to: `${APP_ROUTES.admin}/${APP_ROUTES.adminSettings}`,
    end: true
  }
];
