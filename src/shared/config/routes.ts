export const APP_ROUTES = {
  home: "/",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminSchedule: "schedule",
  adminCrackSafeSnapshot: "crack-safe/snapshot/:startDate",
  adminLuckyMeadowSnapshot: "lucky-meadow/snapshot/:startDate",
  adminPrizes: "prizes",
  adminConsolation: "consolation",
  adminSettings: "settings",
  adminSettingsAi: "settings/ai",
  luckyMeadow: "lucky-meadow"
} as const;
