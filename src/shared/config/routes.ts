export const APP_ROUTES = {
  home: "/",
  mine: "/mine",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminCrackSafe: "crack-safe",
  adminCrackSafeRules: "crack-safe/rules",
  adminCrackSafeSnapshots: "crack-safe/snapshots",
  adminCrackSafeSnapshot: "crack-safe/snapshots/:gameDate",
  adminPrizes: "prizes",
  adminConsolation: "consolation",
  adminSettings: "settings",
  adminSettingsAi: "settings/ai"
} as const;
