import { type MineSceneCellClick } from "@/entities/mine";

import { type MineGameZone } from "../model/types";

export function isMineZoneHit(zone: MineGameZone, cellClick: MineSceneCellClick): boolean {
  if (zone.cellIndex !== cellClick.cellIndex) {
    return false;
  }

  const distanceX = (cellClick.cellX - zone.x) * cellClick.cellWidth;
  const distanceY = (cellClick.cellY - zone.y) * cellClick.cellHeight;
  const distance = Math.hypot(distanceX, distanceY);
  const zoneRadius = Math.min(cellClick.cellWidth, cellClick.cellHeight) * zone.radius;

  return distance <= zoneRadius;
}
