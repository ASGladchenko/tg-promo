export const APP_ROUTES = {
  home: "/",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminSchedule: "schedule",
  adminCrackSafeSnapshot: "crack-safe/snapshot/:startDate",
  adminLuckyMeadowSnapshot: "lucky-meadow/snapshot/:startDate",
  adminLuckyMeadowUserSessions: "lucky-meadow/snapshot/:startDate/:id",
  adminPrizes: "prizes",
  adminConsolation: "consolation",
  adminSettings: "settings",
  adminSettingsAi: "settings/ai",
  adminSettingsAttemptRewards: "settings/attempt-rewards"
} as const;
