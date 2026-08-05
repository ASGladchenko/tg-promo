export const APP_ROUTES = {
  home: "/",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminCrackSafe: "crack-safe",
  adminCrackSafeRules: "crack-safe/rules",
  adminCrackSafeSnapshots: "crack-safe/snapshots",
  adminCrackSafeSnapshot: "crack-safe/snapshots/:startDate",
  adminPrizes: "prizes",
  adminConsolation: "consolation",
  adminSettings: "settings",
  adminSettingsAi: "settings/ai",
  luckyMeadow: "lucky-meadow"
} as const;
