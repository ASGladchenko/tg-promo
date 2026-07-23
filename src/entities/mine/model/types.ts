import { type MineSceneCellIndex, type MineSceneZoneKind } from "../ui";

export type MineServerSessionStatus = "finished" | "running";

export type MineServerRiskLevel = "blocked" | "clear" | "watch";

export type MineServerClickOutcome = "blocked" | "hit" | "miss";

export type MineServerZone = {
  cellIndex: MineSceneCellIndex;
  expiresAt: string;
  id: string;
  kind: MineSceneZoneKind;
  radius: number;
  reward: number;
  startsAt: string;
  x: number;
  y: number;
};

export type MineServerSessionState = {
  activeZones: MineServerZone[];
  clickSequence: number;
  endsAt: string;
  id: string;
  nextRefreshAt: string;
  riskLevel: MineServerRiskLevel;
  riskScore: number;
  score: number;
  serverTime: string;
  startedAt: string;
  status: MineServerSessionStatus;
};

export type MineServerWallet = {
  isChannelBonusGranted: boolean;
  notExpiredAttempts: number;
  todayAttempts: number;
  version: number;
};

export type MineStartSessionResult = MineServerSessionState & {
  wallet: MineServerWallet;
};

export type MineClickResult = {
  outcome: MineServerClickOutcome;
  rewardDelta: number;
  score: number;
  targetKind: MineSceneZoneKind | null;
  wasRewardBlocked: boolean;
};

export type MineClickSessionResult = MineServerSessionState & {
  click: MineClickResult;
};

export type MineSessionClickPayload = {
  cellIndex: MineSceneCellIndex;
  cellX: number;
  cellY: number;
  clientClickedAt: string;
  sceneX: number;
  sceneY: number;
  sequence: number;
  zoneId: string | null;
};

export type MineSocketError = {
  code: string;
  message: string;
};
