import { type MineSceneCellIndex, type MineSceneZone, type MineSceneZoneKind } from "@/entities/mine";

export type MineSessionStatus = "countdown" | "finished" | "idle" | "running";

export type MineSessionCountdownStep = "1" | "2" | "3" | "go";

export type MineSessionClickOutcome = "blocked" | "hit" | "miss";

export type MineSessionRiskFlag =
  | "fast-reaction"
  | "high-precision-run"
  | "low-jitter-intervals"
  | "perfect-zone-click"
  | "rapid-click"
  | "repeated-point";

export type MineSessionRiskLevel = "blocked" | "clear" | "watch";

export type MineSessionRiskState = {
  flags: readonly MineSessionRiskFlag[];
  level: MineSessionRiskLevel;
  score: number;
};

export type MineGameZone = MineSceneZone & {
  expiresAt: number;
  id: string;
  reward: number;
  startsAt: number;
};

export type MineCollectEffect = {
  id: string;
  kind: MineSceneZoneKind;
  sceneX: number;
  sceneY: number;
};

export type MineMissEffect = {
  id: string;
  penalty: number;
  sceneX: number;
  sceneY: number;
};

export type MineSessionJournalEntry = {
  cellIndex: MineSceneCellIndex;
  cellX: number;
  cellY: number;
  clickedAt: number;
  elapsedMs: number;
  id: string;
  intervalMs: number | null;
  outcome: MineSessionClickOutcome;
  reactionMs: number | null;
  rewardDelta: number;
  riskFlags: readonly MineSessionRiskFlag[];
  riskScore: number;
  sceneX: number;
  sceneY: number;
  sequence: number;
  targetKind: MineSceneZoneKind | null;
  wasRewardBlocked: boolean;
  zoneDistanceRatio: number | null;
};
