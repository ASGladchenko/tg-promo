import { type MineSceneZone, type MineSceneZoneKind } from "@/entities/mine";

export type MineSessionStatus = "countdown" | "finished" | "idle" | "running" | "starting";

export type MineSessionCountdownStep = "1" | "2" | "3" | "go";

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
