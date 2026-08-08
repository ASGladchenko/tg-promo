import { useEffect, useRef } from "react";

import {
  Application,
  Assets,
  Container,
  Graphics,
  MeshSimple,
  PerspectiveMesh,
  Polygon,
  Rectangle,
  Sprite,
  Text,
  Texture
} from "pixi.js";

import environmentCastleUrl from "@/shared/images/lion-road/asd/castle.png";
import rockUrl from "@/shared/images/lion-road/asd/rock.png";
import skyUrl from "@/shared/images/lion-road/asd/sky.png";
import voidUrl from "@/shared/images/lion-road/asd/void.png";
import gridFrontUrl from "@/shared/images/lion-road/grid/grid-front.png";
import gridTopUrl from "@/shared/images/lion-road/grid/grid-top.png";
import spikeMetalUrl from "@/shared/images/lion-road/texture/spike-metal.png";
import lionAirUrl from "@/shared/images/lion-road/lion-air.png";
import lionExplosionFinalUrl from "@/shared/images/lion-road/lion-explosion/lion-explosion-final.png";
import lionExplosionFrameUrl from "@/shared/images/lion-road/lion-explosion/lion-explosion-explosion.png";
import lionExplosionMiddleUrl from "@/shared/images/lion-road/lion-explosion/lion-explosion-midle.png";
import lionExplosionStartUrl from "@/shared/images/lion-road/lion-explosion/lion-explosion-start.png";
import lionFallFlailLeftUrl from "@/shared/images/lion-road/lion-fall/lion_fall_flail_left.png";
import lionFallFlailRightUrl from "@/shared/images/lion-road/lion-fall/lion_fall_flail_right.png";
import lionFallStartUrl from "@/shared/images/lion-road/lion-fall/lion_fall_start.png";
import lionFallStrongUrl from "@/shared/images/lion-road/lion-fall/lion_fall_strong.png";
import lionIdleUrl from "@/shared/images/lion-road/lion-idle.png";
import lionJoyJumpFinalUrl from "@/shared/images/lion-road/joy-jump/joy-jump-final.png";
import lionJoyJumpMiddleUrl from "@/shared/images/lion-road/joy-jump/joy-jum-midle.png";
import lionJoyJumpStartUrl from "@/shared/images/lion-road/joy-jump/joy-jump-start.png";
import lionJoyJumpTopUrl from "@/shared/images/lion-road/joy-jump/joy-jump-top.png";
import lionLandUrl from "@/shared/images/lion-road/lion-land.png";
import lionPrepareUrl from "@/shared/images/lion-road/lion-prepare.png";
import lionReversalFinalUrl from "@/shared/images/lion-road/lion-reversal/lion-reversal-final.png";
import lionReversalMiddleUrl from "@/shared/images/lion-road/lion-reversal/lion-reversal-middle.png";
import lionReversalStartUrl from "@/shared/images/lion-road/lion-reversal/lion-reversal-start.png";
import lionTakeoffUrl from "@/shared/images/lion-road/lion-take_off.png";

import "./lion-road-prototype.scss";

type Cell = {
  col: number;
  row: number;
};
type ScreenPoint = {
  x: number;
  y: number;
};
type CellQuad = {
  bottomLeft: ScreenPoint;
  bottomRight: ScreenPoint;
  topLeft: ScreenPoint;
  topRight: ScreenPoint;
};
type LionState =
  | "idle"
  | "prepare"
  | "takeoff"
  | "air"
  | "land"
  | "explosionStart"
  | "explosionMiddle"
  | "explosionFrame"
  | "explosionFinal"
  | "fallFlailLeft"
  | "fallFlailRight"
  | "fallStart"
  | "fallStrong"
  | "reversalStart"
  | "reversalMiddle"
  | "reversalFinal"
  | "joyJumpStart"
  | "joyJumpMiddle"
  | "joyJumpTop"
  | "joyJumpFinal";
type LionDirection = -1 | 1;
type GamePhase = "checking" | "gameOver" | "jumping" | "playing" | "trapResolving";
type LionRoadCellCheckResult = "fall" | "safe" | "spikes";
type LionRoadCellCheckResponse = {
  result: LionRoadCellCheckResult;
};
type GameOverUi = {
  destroy: () => void;
  hide: () => void;
  show: () => void;
  updateLayout: () => void;
};
type LionTextures = Record<LionState, Texture>;
type GridTileState = "CLOSED" | "SELECTED" | "SAFE" | "REWARD" | "GENEROUS_REWARD" | "TRAP" | "DANGER";
type GridTextures = {
  front: Texture;
  top: Texture;
};
type BoardCell = Cell & {
  tile: PerspectiveGridTile;
};
type EnvironmentTextures = {
  castle: Texture;
  rock: Texture;
  sky: Texture;
  void: Texture;
};
type Environment = {
  castle: Sprite;
  island: Container;
  rock: Sprite;
  sky: Sprite;
  void: Sprite;
};
type ViewportSize = {
  height: number;
  width: number;
};

const CANVAS = {
  width: 390,
  height: 700
} as const;
// Все координаты поля собраны здесь: менять размер, gap или положение можно без поиска по файлу.
const BOARD = {
  rows: 10,
  cols: 3,
  nearY: 626,
  farY: 128,
  nearWidth: 330,
  farWidth: 124,
  depthPower: 0.88,
  gap: 4,
  floorY: 684,
  backRows: 1,
  backY: CANVAS.height
} as const;

const START_CELL: Cell = {
  row: BOARD.rows,
  col: 1
};

const JUMP = {
  durationMs: 580,
  arcHeight: 24,
  landMs: 80
} as const;

const CELL_CHECK_MOCK = {
  delayMs: 220,
  trapChance: 1 / 3
} as const;

const FALL = {
  tileShakeMs: 420,
  tileFallMs: 560,
  lionStartFrameMs: 140,
  lionStrongFrameMs: 140,
  lionFallMs: 900,
  lionFrameMs: 130,
  tileShakeOffsetPx: 5,
  tileFallDriftPx: 12,
  tileFallOverscanPx: 160,
  tileFallRotation: 0.18,
  lionFallDriftPx: 14,
  lionFallOverscanPx: 260
} as const;

const SPIKE_TRAP = {
  revealOvershoot: 1,
  explosionFrameMs: 250,
  heightRatio: 0.62,
  jumpRevealStart: 0.45,
  lionLandingLiftRatio: 0.26,
  zIndexOffset: 0.5
} as const;

const SPIKE_POINTS = [
  { depth: 0.24, scale: 0.82, width: 0 },
  { depth: -0.02, scale: 0.94, width: -0.24 },
  { depth: -0.02, scale: 0.94, width: 0.24 },
  { depth: -0.28, scale: 1, width: -0.13 },
  { depth: -0.28, scale: 1, width: 0.13 }
] as const;

const SPIKE_FACE_INDICES = new Uint32Array([0, 1, 2]);
const SPIKE_FACE_UVS = new Float32Array([0.5, 0.04, 0.06, 0.96, 0.94, 0.96]);
const SPIKE_FACE_TINT = {
  backLeft: 0x697784,
  backRight: 0x9aa8b4,
  frontLeft: 0x4f5964,
  frontRight: 0x748494
} as const;

const GAME_OVER = {
  titleMs: 1200,
  buttonWidth: 168,
  buttonHeight: 52,
  buttonRadius: 14
} as const;

const CAMERA = {
  followDepth: 1
} as const;

const FINAL_LION = {
  shouldPlayExplosionBeforeCelebration: false,
  lastCellOffsetY: -36,
  explosionFrameMs: 180,
  reversalFrameMs: 150,
  joyJumpFrameMs: 220
} as const;

const GRID_TILE = {
  frontLowerGapPx: 0.5,
  frontOverlapPx: 0.75,
  frontVerticesX: 16,
  frontVerticesY: 4,
  debugCornerRadius: 3,
  sideVerticesX: 16,
  sideVerticesY: 4,
  thicknessRatio: 0.08,
  topVerticesX: 16,
  topVerticesY: 16
} as const;

const CELL_GLOW = {
  actionColor: 0xffef9a,
  actionGlowWidth: 10,
  actionStrokeWidth: 3,
  currentColor: 0x5cffb1,
  currentGlowWidth: 12,
  currentStrokeWidth: 3,
  targetColor: 0xffd45a,
  targetCycleMs: 2600,
  targetPhaseStep: 0.18,
  targetGlowWidth: 9
} as const;

const GRID_TEXTURE = {
  maxAnisotropy: 4
} as const;

const SLOW_GRID_CAMERA = {
  periodMs: 6000,
  rowTravel: 4
} as const;

const ENVIRONMENT_CONFIG = {
  void: {
    roadEndOffset: 0,
    bottomOverscan: 160
  },
  rock: {
    anchorY: 0.3,
    minWidthMultiplier: 1.32
  },
  castle: {
    roadEndOffset: 0,
    visualScale: 0.9,
    startWidthMultiplier: 0.85,
    endWidthMultiplier: 2.5,
    maxProgress: BOARD.rows - 1
  }
} as const;

const LION_HEIGHT = 180;
const LION_ANCHOR_Y = 0.58;

const lionTextureUrls: Record<LionState, string> = {
  idle: lionIdleUrl,
  prepare: lionPrepareUrl,
  takeoff: lionTakeoffUrl,
  air: lionAirUrl,
  land: lionLandUrl,
  explosionStart: lionExplosionStartUrl,
  explosionMiddle: lionExplosionMiddleUrl,
  explosionFrame: lionExplosionFrameUrl,
  explosionFinal: lionExplosionFinalUrl,
  fallFlailLeft: lionFallFlailLeftUrl,
  fallFlailRight: lionFallFlailRightUrl,
  fallStart: lionFallStartUrl,
  fallStrong: lionFallStrongUrl,
  reversalStart: lionReversalStartUrl,
  reversalMiddle: lionReversalMiddleUrl,
  reversalFinal: lionReversalFinalUrl,
  joyJumpStart: lionJoyJumpStartUrl,
  joyJumpMiddle: lionJoyJumpMiddleUrl,
  joyJumpTop: lionJoyJumpTopUrl,
  joyJumpFinal: lionJoyJumpFinalUrl
};

const lionExplosionStates = [
  "explosionStart",
  "explosionMiddle",
  "explosionFrame",
  "explosionFinal"
] as const;
const lionReversalStates = ["reversalStart", "reversalMiddle", "reversalFinal"] as const;
const lionJoyJumpStates = ["joyJumpStart", "joyJumpMiddle", "joyJumpTop", "joyJumpFinal"] as const;
const lionFallLoopStates = ["fallFlailLeft", "fallFlailRight"] as const;

const lionJoyJumpOffsets: Record<(typeof lionJoyJumpStates)[number], number> = {
  joyJumpStart: 0,
  joyJumpMiddle: 12,
  joyJumpTop: 22,
  joyJumpFinal: 6
};

class PerspectiveGridTile {
  readonly view = new Container();

  private readonly actionGlow = new Graphics();
  private readonly currentGlow = new Graphics();
  private readonly debugView?: Graphics;
  private fallAlpha = 1;
  private fallOffsetX = 0;
  private fallOffsetY = 0;
  private fallRotation = 0;
  private readonly frontMesh: PerspectiveMesh;
  private readonly hitArea = new Polygon([0, 0, 0, 0, 0, 0, 0, 0]);
  private isActionGlowVisible = false;
  private isCurrentGlowVisible = false;
  private isTargetGlowVisible = false;
  private readonly leftMesh: PerspectiveMesh;
  private readonly overlay = new Container();
  private quad: CellQuad | null = null;
  private readonly rightMesh: PerspectiveMesh;
  private readonly targetGlow = new Graphics();
  private targetGlowIndex = 0;
  private readonly topMesh: PerspectiveMesh;
  private state: GridTileState = "CLOSED";

  constructor(textures: GridTextures, isDebugEnabled: boolean) {
    this.frontMesh = new PerspectiveMesh({
      roundPixels: false,
      texture: textures.front,
      verticesX: GRID_TILE.frontVerticesX,
      verticesY: GRID_TILE.frontVerticesY
    });
    this.leftMesh = new PerspectiveMesh({
      roundPixels: false,
      texture: textures.front,
      verticesX: GRID_TILE.sideVerticesX,
      verticesY: GRID_TILE.sideVerticesY
    });
    this.rightMesh = new PerspectiveMesh({
      roundPixels: false,
      texture: textures.front,
      verticesX: GRID_TILE.sideVerticesX,
      verticesY: GRID_TILE.sideVerticesY
    });
    this.topMesh = new PerspectiveMesh({
      roundPixels: false,
      texture: textures.top,
      verticesX: GRID_TILE.topVerticesX,
      verticesY: GRID_TILE.topVerticesY
    });

    this.frontMesh.eventMode = "none";
    this.leftMesh.eventMode = "none";
    this.rightMesh.eventMode = "none";
    this.topMesh.eventMode = "none";
    this.overlay.eventMode = "none";
    this.targetGlow.eventMode = "none";
    this.actionGlow.eventMode = "none";
    this.currentGlow.eventMode = "none";
    this.frontMesh.zIndex = 0;
    this.leftMesh.zIndex = 0;
    this.rightMesh.zIndex = 0;
    this.topMesh.zIndex = 1;
    this.overlay.zIndex = 2;
    this.targetGlow.zIndex = 0;
    this.actionGlow.zIndex = 1;
    this.currentGlow.zIndex = 2;
    this.view.hitArea = this.hitArea;
    this.view.interactiveChildren = false;
    this.view.sortableChildren = true;
    this.overlay.sortableChildren = true;
    this.overlay.addChild(this.targetGlow, this.actionGlow, this.currentGlow);
    this.view.addChild(this.leftMesh, this.rightMesh, this.frontMesh, this.topMesh, this.overlay);

    if (isDebugEnabled) {
      this.debugView = new Graphics();
      this.debugView.eventMode = "none";
      this.debugView.zIndex = 3;
      this.view.addChild(this.debugView);
    }
  }

  hide() {
    this.view.visible = false;
    this.view.eventMode = "none";
    this.view.cursor = "default";
    this.setGlowState(false, false);
  }

  setInteractive(isInteractive: boolean) {
    this.view.eventMode = isInteractive ? "static" : "none";
    this.view.cursor = isInteractive ? "pointer" : "default";
  }

  setGlowState(
    isTargetGlowVisible: boolean,
    isCurrentGlowVisible: boolean,
    targetGlowIndex = 0,
    isActionGlowVisible = false
  ) {
    const shouldShowActionGlow = isActionGlowVisible && !isCurrentGlowVisible;
    const shouldShowTargetGlow = isTargetGlowVisible && !isCurrentGlowVisible && !shouldShowActionGlow;

    if (
      this.isActionGlowVisible === shouldShowActionGlow &&
      this.isTargetGlowVisible === shouldShowTargetGlow &&
      this.isCurrentGlowVisible === isCurrentGlowVisible &&
      this.targetGlowIndex === targetGlowIndex
    ) {
      return;
    }

    this.isActionGlowVisible = shouldShowActionGlow;
    this.isTargetGlowVisible = shouldShowTargetGlow;
    this.isCurrentGlowVisible = isCurrentGlowVisible;
    this.targetGlowIndex = targetGlowIndex;
    this.actionGlow.visible = shouldShowActionGlow;
    this.targetGlow.visible = shouldShowTargetGlow;
    this.currentGlow.visible = isCurrentGlowVisible;

    if (!shouldShowActionGlow) {
      this.actionGlow.clear();
    }

    if (!shouldShowTargetGlow) {
      this.targetGlow.clear();
    }

    if (!isCurrentGlowVisible) {
      this.currentGlow.clear();
    }
  }

  setState(state: GridTileState) {
    if (this.state === state) {
      return;
    }

    this.state = state;
  }

  updateGeometry({
    bottomLeft,
    bottomRight,
    depth,
    maxThicknessPx,
    topLeft,
    topRight
  }: CellQuad & { depth: number; maxThicknessPx?: number }) {
    const tileThicknessPx =
      getTileScreenHeight({ bottomLeft, bottomRight, topLeft, topRight }) * GRID_TILE.thicknessRatio;
    const thicknessPx =
      maxThicknessPx === undefined ? tileThicknessPx : Math.min(tileThicknessPx, maxThicknessPx);
    const frontTopLeft = {
      x: bottomLeft.x,
      y: bottomLeft.y - GRID_TILE.frontOverlapPx
    };
    const frontTopRight = {
      x: bottomRight.x,
      y: bottomRight.y - GRID_TILE.frontOverlapPx
    };
    const frontBottomRight = {
      x: bottomRight.x,
      y: bottomRight.y + thicknessPx
    };
    const frontBottomLeft = {
      x: bottomLeft.x,
      y: bottomLeft.y + thicknessPx
    };
    const leftBottomLeft = {
      x: topLeft.x,
      y: topLeft.y + thicknessPx
    };
    const rightBottomLeft = {
      x: topRight.x,
      y: topRight.y + thicknessPx
    };

    this.quad = {
      bottomLeft,
      bottomRight,
      topLeft,
      topRight
    };
    this.view.visible = true;
    this.view.zIndex = Math.max(depth, bottomLeft.y, bottomRight.y) + thicknessPx;
    this.applyFallTransform();
    this.topMesh.setCorners(
      topLeft.x,
      topLeft.y,
      topRight.x,
      topRight.y,
      bottomRight.x,
      bottomRight.y,
      bottomLeft.x,
      bottomLeft.y
    );
    this.frontMesh.setCorners(
      frontTopLeft.x,
      frontTopLeft.y,
      frontTopRight.x,
      frontTopRight.y,
      frontBottomRight.x,
      frontBottomRight.y,
      frontBottomLeft.x,
      frontBottomLeft.y
    );
    this.leftMesh.setCorners(
      topLeft.x,
      topLeft.y,
      bottomLeft.x,
      bottomLeft.y,
      frontBottomLeft.x,
      frontBottomLeft.y,
      leftBottomLeft.x,
      leftBottomLeft.y
    );
    this.rightMesh.setCorners(
      topRight.x,
      topRight.y,
      bottomRight.x,
      bottomRight.y,
      frontBottomRight.x,
      frontBottomRight.y,
      rightBottomLeft.x,
      rightBottomLeft.y
    );
    this.hitArea.points = [
      topLeft.x,
      topLeft.y,
      topRight.x,
      topRight.y,
      bottomRight.x,
      bottomRight.y,
      bottomLeft.x,
      bottomLeft.y
    ];

    this.renderDebug({ bottomLeft, bottomRight, topLeft, topRight }, thicknessPx);
  }

  resetFallTransform() {
    this.fallAlpha = 1;
    this.fallOffsetX = 0;
    this.fallOffsetY = 0;
    this.fallRotation = 0;
    this.applyFallTransform();
  }

  renderGlow(timeMs: number) {
    if (!this.quad || !this.view.visible) {
      return;
    }

    if (this.isTargetGlowVisible) {
      this.renderTargetGlow(timeMs);
    }

    if (this.isActionGlowVisible) {
      this.renderActionGlow();
    }

    if (this.isCurrentGlowVisible) {
      this.renderCurrentGlow();
    }
  }

  private getGlowSize(size: number) {
    if (!this.quad) {
      return size;
    }

    return Math.max(Math.min(size, getTileScreenHeight(this.quad) * 0.45), 1);
  }

  setFallTransform({
    alpha = 1,
    offsetX = 0,
    offsetY = 0,
    rotation = 0
  }: {
    alpha?: number;
    offsetX?: number;
    offsetY?: number;
    rotation?: number;
  }) {
    this.fallAlpha = alpha;
    this.fallOffsetX = offsetX;
    this.fallOffsetY = offsetY;
    this.fallRotation = rotation;
    this.applyFallTransform();
  }

  private applyFallTransform() {
    if (!this.quad) {
      this.view.alpha = this.fallAlpha;
      this.view.position.set(this.fallOffsetX, this.fallOffsetY);
      this.view.rotation = this.fallRotation;
      return;
    }

    const center = getPolygonCenter(getCellQuadPolygon(this.quad));

    this.view.alpha = this.fallAlpha;
    this.view.pivot.set(center.x, center.y);
    this.view.position.set(center.x + this.fallOffsetX, center.y + this.fallOffsetY);
    this.view.rotation = this.fallRotation;
  }

  private renderCurrentGlow() {
    if (!this.quad) {
      return;
    }

    const points = getCellQuadPolygon(this.quad);

    this.currentGlow
      .clear()
      .poly(points, true)
      .stroke({
        alpha: 0.28,
        color: CELL_GLOW.currentColor,
        join: "round",
        width: this.getGlowSize(CELL_GLOW.currentGlowWidth)
      })
      .poly(points, true)
      .stroke({
        alpha: 0.95,
        color: CELL_GLOW.currentColor,
        join: "round",
        width: this.getGlowSize(CELL_GLOW.currentStrokeWidth)
    });
  }

  private renderActionGlow() {
    if (!this.quad) {
      return;
    }

    const points = getCellQuadPolygon(this.quad);

    this.actionGlow
      .clear()
      .poly(points, true)
      .fill({
        alpha: 0.08,
        color: CELL_GLOW.actionColor
      })
      .poly(points, true)
      .stroke({
        alpha: 0.34,
        color: CELL_GLOW.actionColor,
        join: "round",
        width: this.getGlowSize(CELL_GLOW.actionGlowWidth)
      })
      .poly(points, true)
      .stroke({
        alpha: 0.72,
        color: CELL_GLOW.actionColor,
        join: "round",
        width: this.getGlowSize(CELL_GLOW.actionStrokeWidth)
      });
  }

  private renderTargetGlow(timeMs: number) {
    if (!this.quad) {
      return;
    }

    const points = getCellQuadPolygon(this.quad);
    const phase =
      ((timeMs % CELL_GLOW.targetCycleMs) / CELL_GLOW.targetCycleMs -
        this.targetGlowIndex * CELL_GLOW.targetPhaseStep +
        1) %
      1;
    const pulse = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;

    this.targetGlow
      .clear()
      .poly(points, true)
      .fill({
        alpha: 0.1 + pulse * 0.12,
        color: CELL_GLOW.targetColor
      })
      .poly(points, true)
      .stroke({
        alpha: 0.15 + pulse * 0.17,
        color: CELL_GLOW.targetColor,
        join: "round",
        width: this.getGlowSize(CELL_GLOW.targetGlowWidth)
      });
  }

  private renderDebug(quad: CellQuad, thicknessPx: number) {
    if (!this.debugView) {
      return;
    }

    const { bottomLeft, bottomRight, topLeft, topRight } = quad;
    const midBottomX = (bottomLeft.x + bottomRight.x) / 2;
    const midBottomY = (bottomLeft.y + bottomRight.y) / 2;

    this.debugView
      .clear()
      .poly(
        [
          topLeft.x,
          topLeft.y,
          topRight.x,
          topRight.y,
          bottomRight.x,
          bottomRight.y,
          bottomLeft.x,
          bottomLeft.y
        ],
        true
      )
      .stroke({ color: 0x7dd3fc, width: 1 })
      .circle(topLeft.x, topLeft.y, GRID_TILE.debugCornerRadius)
      .fill(0xff3b30)
      .circle(topRight.x, topRight.y, GRID_TILE.debugCornerRadius)
      .fill(0x34c759)
      .circle(bottomRight.x, bottomRight.y, GRID_TILE.debugCornerRadius)
      .fill(0x0a84ff)
      .circle(bottomLeft.x, bottomLeft.y, GRID_TILE.debugCornerRadius)
      .fill(0xffcc00)
      .moveTo(midBottomX, midBottomY)
      .lineTo(midBottomX, midBottomY + thicknessPx)
      .stroke({ color: 0xff2d55, width: 1 });
  }
}

class SpikeTrap {
  readonly view = new Container();

  private readonly faceMeshes: MeshSimple[] = [];
  private readonly faces = new Container();
  private readonly outline = new Graphics();
  private readonly shadow = new Graphics();

  constructor(stage: Container, private readonly faceTexture: Texture) {
    this.view.eventMode = "none";
    this.view.visible = false;
    this.faces.eventMode = "none";
    this.outline.eventMode = "none";
    this.shadow.eventMode = "none";
    this.view.addChild(this.shadow, this.faces, this.outline);
    stage.addChild(this.view);
  }

  hide() {
    this.view.visible = false;
    this.shadow.clear();
    this.outline.clear();
    this.hideUnusedFaceMeshes(0);
  }

  updateGeometry(quad: CellQuad, reveal: number, zIndex: number) {
    const polygon = getCellQuadPolygon(quad);
    const center = getPolygonCenter(polygon);
    const visibleReveal = clamp(reveal, 0, SPIKE_TRAP.revealOvershoot);

    if (visibleReveal <= 0) {
      this.hide();
      return;
    }

    this.view.visible = true;
    this.view.position.set(center.x, center.y);
    this.view.zIndex = zIndex;
    this.renderSpikes(quad, center, visibleReveal);
  }

  private renderSpikes(quad: CellQuad, center: ScreenPoint, reveal: number) {
    const topMid = getMidpoint(quad.topLeft, quad.topRight);
    const bottomMid = getMidpoint(quad.bottomLeft, quad.bottomRight);
    const widthAxis = getNormalizedVector({
      x: quad.bottomRight.x - quad.bottomLeft.x,
      y: quad.bottomRight.y - quad.bottomLeft.y
    });
    const depthAxis = getNormalizedVector({
      x: topMid.x - bottomMid.x,
      y: topMid.y - bottomMid.y
    });
    const outAxis = getNormalizedVector({
      x: depthAxis.x * 0.35,
      y: -1
    });
    const backWidth = getDistance(quad.topLeft, quad.topRight);
    const frontWidth = getDistance(quad.bottomLeft, quad.bottomRight);
    const cellWidth = (backWidth + frontWidth) / 2;
    const cellHeight = getTileScreenHeight(quad);
    const maxHeight = cellHeight * SPIKE_TRAP.heightRatio * reveal;
    const getPoint = (widthOffset: number, depthOffset: number, outOffset: number): ScreenPoint => ({
      x: center.x + widthAxis.x * widthOffset + depthAxis.x * depthOffset + outAxis.x * outOffset,
      y: center.y + widthAxis.y * widthOffset + depthAxis.y * depthOffset + outAxis.y * outOffset
    });
    const toLocalPolygon = (points: ScreenPoint[]) =>
      points.flatMap((point) => [point.x - center.x, point.y - center.y]);
    const toLocalVertices = (points: ScreenPoint[]) =>
      new Float32Array(points.flatMap((point) => [point.x - center.x, point.y - center.y]));
    let meshIndex = 0;

    this.shadow.clear();
    this.outline.clear();

    SPIKE_POINTS.forEach((spikePoint) => {
      const normalizedDepth = clamp(spikePoint.depth + 0.5, 0, 1);
      const perspectiveWidth = lerp(frontWidth, backWidth, normalizedDepth) * 0.5;
      const x = perspectiveWidth * spikePoint.width;
      const depth = cellHeight * spikePoint.depth;
      const spikeWidth = cellWidth * 0.13 * spikePoint.scale;
      const spikeDepth = cellHeight * 0.13 * spikePoint.scale;
      const spikeHeight = maxHeight * spikePoint.scale;
      const apex = getPoint(x, depth + spikeDepth * 0.18, spikeHeight);
      const baseBack = getPoint(x, depth + spikeDepth * 0.6, 0);
      const baseFront = getPoint(x, depth - spikeDepth * 0.56, 0);
      const baseLeft = getPoint(x - spikeWidth / 2, depth - spikeDepth * 0.08, 0);
      const baseRight = getPoint(x + spikeWidth / 2, depth - spikeDepth * 0.08, 0);

      this.shadow
        .poly(toLocalPolygon([baseLeft, baseBack, baseRight, baseFront]), true)
        .fill({ alpha: 0.24, color: 0x070604 });

      meshIndex = this.renderFace(meshIndex, toLocalVertices([apex, baseBack, baseLeft]), SPIKE_FACE_TINT.backLeft);
      meshIndex = this.renderFace(meshIndex, toLocalVertices([apex, baseRight, baseBack]), SPIKE_FACE_TINT.backRight);
      meshIndex = this.renderFace(meshIndex, toLocalVertices([apex, baseLeft, baseFront]), SPIKE_FACE_TINT.frontLeft);
      meshIndex = this.renderFace(
        meshIndex,
        toLocalVertices([apex, baseFront, baseRight]),
        SPIKE_FACE_TINT.frontRight
      );

      this.outline
        .poly(toLocalPolygon([apex, baseLeft, baseFront, baseRight, baseBack]), false)
        .stroke({ alpha: 0.26, color: 0xb7c2cf, width: Math.max(spikeWidth * 0.045, 1) });
    });
    this.hideUnusedFaceMeshes(meshIndex);
  }

  private renderFace(index: number, vertices: Float32Array, tint: number) {
    const mesh = this.getFaceMesh(index);

    mesh.tint = tint;
    mesh.vertices = vertices;

    return index + 1;
  }

  private getFaceMesh(index: number) {
    const existingMesh = this.faceMeshes[index];

    if (existingMesh) {
      existingMesh.visible = true;
      return existingMesh;
    }

    const mesh = new MeshSimple({
      indices: SPIKE_FACE_INDICES,
      roundPixels: false,
      texture: this.faceTexture,
      uvs: SPIKE_FACE_UVS,
      vertices: new Float32Array(6)
    });

    mesh.eventMode = "none";
    this.faceMeshes[index] = mesh;
    this.faces.addChild(mesh);

    return mesh;
  }

  private hideUnusedFaceMeshes(visibleCount: number) {
    for (let index = visibleCount; index < this.faceMeshes.length; index += 1) {
      this.faceMeshes[index].visible = false;
    }
  }
}

export function LionRoadPrototype() {
  const canvasRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposePixi = () => {};
    let isDisposed = false;

    void initPixi(canvasRootRef.current, () => isDisposed).then((dispose) => {
      if (isDisposed) {
        dispose();
        return;
      }

      disposePixi = dispose;
    });

    return () => {
      isDisposed = true;
      disposePixi();
    };
  }, []);

  return (
    <main className="lion-road">
      <div className="lion-road__canvas" ref={canvasRootRef} />
    </main>
  );
}

async function initPixi(host: HTMLDivElement | null, shouldStop: () => boolean) {
  if (!host) {
    return () => {};
  }

  const pixiHost = host;
  const app = new Application();
  let viewportSize = getHostViewportSize(pixiHost);
  let isDestroyed = false;
  let landTimer: number | undefined;
  let lionExplosionTimer: number | undefined;
  let lionReversalTimer: number | undefined;
  let lionJoyJumpTimer: number | undefined;
  let gameOverUi: GameOverUi | null = null;
  const resizeObserver = new ResizeObserver(() => handleResize());
  let joyJumpBaseY = 0;

  const destroy = () => {
    if (isDestroyed) {
      return;
    }

    isDestroyed = true;
    window.clearTimeout(landTimer);
    gameOverUi?.destroy();
    clearFinalLionAnimation();
    app.ticker.remove(updateCellGlows);
    app.ticker.remove(updateSlowCameraDebug);
    resizeObserver.disconnect();
    window.removeEventListener("keydown", handleResetKey);
    window.removeEventListener("resize", handleResize);
    app.destroy({ removeView: true }, { children: true });
  };

  await app.init({
    width: viewportSize.width,
    height: viewportSize.height,
    backgroundColor: 0x11131a,
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2)
  });

  if (shouldStop()) {
    return destroy;
  }

  pixiHost.append(app.canvas);

  const worldRoot = new Container();
  const skyLayer = new Container();
  const voidLayer = new Container();
  const islandLayer = new Container();
  const gameplayLayer = new Container();
  const gridLayer = new Container();
  const effectsLayer = new Container();
  const uiLayer = new Container();

  gameplayLayer.sortableChildren = true;
  gridLayer.sortableChildren = true;
  gameplayLayer.addChild(gridLayer);
  worldRoot.addChild(skyLayer, voidLayer, islandLayer, gameplayLayer, effectsLayer, uiLayer);
  app.stage.addChild(worldRoot);

  const [textures, environmentTextures, gridTextures, spikeTexture] = await Promise.all([
    loadLionTextures(),
    loadEnvironmentTextures(),
    loadGridTextures(),
    loadSpikeTexture()
  ]);

  if (shouldStop()) {
    return destroy;
  }

  const environment = createEnvironment(skyLayer, voidLayer, islandLayer, environmentTextures);
  const boardCells = createBoard(
    gridLayer,
    gridTextures,
    (row, col) => {
      void jumpLionToCell(row, col);
    },
    (cell) => setHoveredCell(cell),
    getGridTileDebugEnabled()
  );

  let lionDirection: LionDirection = 1;
  let lionHeight = LION_HEIGHT;
  const { lion, setLionState } = createLion(gridLayer, textures);
  const spikeTrap = new SpikeTrap(gridLayer, spikeTexture);
  let cameraRow = START_CELL.row;
  let lionCell = { ...START_CELL };
  let activeSpikeCell: Cell | null = null;
  let hoveredCell: Cell | null = null;
  let selectedCell: Cell | null = null;
  let spikeReveal = 0;
  let gamePhase: GamePhase = "playing";

  gameOverUi = createGameOverUi(uiLayer, restartScene);
  resetLionPosition();
  renderBoard();
  app.ticker.add(updateCellGlows);
  if (getGridSlowCameraDebugEnabled()) {
    app.ticker.add(updateSlowCameraDebug);
  }
  window.addEventListener("keydown", handleResetKey);
  window.addEventListener("resize", handleResize);
  resizeObserver.observe(pixiHost);

  function createBoard(
    stage: Container,
    tileTextures: GridTextures,
    onCellClick: (row: number, col: number) => void,
    onCellHover: (cell: Cell | null) => void,
    isDebugEnabled: boolean
  ) {
    const cells: BoardCell[] = [];

    for (let row = 0; row < BOARD.rows; row += 1) {
      for (let col = 0; col < BOARD.cols; col += 1) {
        const tile = new PerspectiveGridTile(tileTextures, isDebugEnabled);

        tile.view.on("pointertap", () => onCellClick(row, col));
        tile.view.on("pointerover", () => onCellHover({ row, col }));
        tile.view.on("pointerout", () => onCellHover(null));
        stage.addChild(tile.view);
        cells.push({ row, col, tile });
      }
    }

    const startTile = new PerspectiveGridTile(tileTextures, isDebugEnabled);

    stage.addChild(startTile.view);
    cells.push({ ...START_CELL, tile: startTile });

    return cells;
  }

  function createEnvironment(
    skyLayer: Container,
    voidLayer: Container,
    islandLayer: Container,
    textures: EnvironmentTextures
  ): Environment {
    const sky = new Sprite(textures.sky);
    const voidSprite = new Sprite(textures.void);
    const island = new Container();
    const rock = new Sprite(textures.rock);
    const castle = new Sprite(textures.castle);

    sky.anchor.set(0.5, 1);
    sky.eventMode = "none";
    voidSprite.anchor.set(0.5, 0);
    voidSprite.eventMode = "none";
    rock.anchor.set(0.5, ENVIRONMENT_CONFIG.rock.anchorY);
    rock.eventMode = "none";
    castle.anchor.set(0.5, 1);
    castle.scale.set(ENVIRONMENT_CONFIG.castle.visualScale);
    castle.eventMode = "none";

    skyLayer.addChild(sky);
    voidLayer.addChild(voidSprite);
    island.addChild(rock, castle);
    islandLayer.addChild(island);

    return {
      castle,
      island,
      rock,
      sky,
      void: voidSprite
    };
  }

  function createLion(stage: Container, lionTextures: LionTextures) {
    const lionSprite = new Sprite(lionTextures.idle);
    let currentState: LionState = "idle";

    lionSprite.anchor.set(0.5, LION_ANCHOR_Y);
    resizeLion(lionSprite, lionDirection, lionHeight);
    stage.addChild(lionSprite);

    const setLionState = (state: LionState) => {
      if (currentState === state) {
        return;
      }

      currentState = state;
      lionSprite.texture = lionTextures[state];
      resizeLion(lionSprite, lionDirection, lionHeight);
    };

    return {
      lion: lionSprite,
      setLionState
    };
  }

  function createGameOverUi(stage: Container, onStart: () => void): GameOverUi {
    const view = new Container();
    const title = new Text({
      text: "Game over",
      style: {
        align: "center",
        fill: 0xfff3b0,
        fontFamily: "Arial",
        fontSize: 48,
        fontWeight: "700",
        stroke: {
          color: 0x2a1708,
          width: 5
        }
      }
    });
    const button = new Container();
    const buttonBg = new Graphics();
    const buttonLabel = new Text({
      text: "Start",
      style: {
        align: "center",
        fill: 0x2a1708,
        fontFamily: "Arial",
        fontSize: 22,
        fontWeight: "700"
      }
    });
    let titleTimer: number | undefined;

    title.anchor.set(0.5);
    buttonLabel.anchor.set(0.5);
    button.eventMode = "static";
    button.cursor = "pointer";
    button.interactiveChildren = false;
    button.visible = false;
    view.visible = false;
    view.zIndex = 20;
    button.addChild(buttonBg, buttonLabel);
    view.addChild(title, button);
    stage.addChild(view);

    button.on("pointerover", () => {
      button.alpha = 0.9;
    });
    button.on("pointerout", () => {
      button.alpha = 1;
    });
    button.on("pointertap", onStart);

    const updateLayout = () => {
      const buttonWidth = scaleViewportX(GAME_OVER.buttonWidth, viewportSize);
      const buttonHeight = scaleViewportX(GAME_OVER.buttonHeight, viewportSize);
      const buttonRadius = scaleViewportX(GAME_OVER.buttonRadius, viewportSize);

      title.style.fontSize = scaleViewportX(48, viewportSize);
      buttonLabel.style.fontSize = scaleViewportX(22, viewportSize);
      title.position.set(viewportSize.width * 0.5, viewportSize.height * 0.43);
      button.position.set(viewportSize.width * 0.5, viewportSize.height * 0.55);
      buttonBg
        .clear()
        .roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, buttonRadius)
        .fill({ color: 0xffd86b, alpha: 0.96 })
        .stroke({ color: 0xffffff, alpha: 0.65, width: scaleViewportX(2, viewportSize) });
      button.hitArea = new Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
    };

    const hide = () => {
      window.clearTimeout(titleTimer);
      view.visible = false;
      title.visible = false;
      button.visible = false;
      button.alpha = 1;
    };

    return {
      destroy: () => {
        hide();
        view.destroy({ children: true });
      },
      hide,
      show: () => {
        window.clearTimeout(titleTimer);
        updateLayout();
        view.visible = true;
        title.visible = true;
        button.visible = false;
        titleTimer = window.setTimeout(() => {
          title.visible = false;
          button.visible = true;
        }, GAME_OVER.titleMs);
      },
      updateLayout
    };
  }

  function getCellPositionAtCamera(row: number, col: number, currentCameraRow: number) {
    return getPolygonCenter(getCellPolygonAtCamera(row, col, currentCameraRow));
  }

  function getLionPosition(row: number, col: number) {
    return getLionPositionAtCamera(row, col, cameraRow);
  }

  function getLionPositionAtCamera(row: number, col: number, currentCameraRow: number) {
    const position = getCellPositionAtCamera(row, col, currentCameraRow);

    return {
      x: position.x,
      y: position.y + getLionCellOffsetY(row, viewportSize)
    };
  }

  function getCellPolygon(row: number, col: number) {
    return getCellPolygonAtCamera(row, col, cameraRow);
  }

  function getCellPolygonAtCamera(row: number, col: number, currentCameraRow: number) {
    if (row === BOARD.rows) {
      return getStartCellPolygon();
    }

    const bottomDepth = getCellDepth(row, currentCameraRow);
    const topLine = getDepthLine(bottomDepth + 1, viewportSize);
    const bottomLine = getDepthLine(bottomDepth, viewportSize);

    return getPerspectiveCellPolygon(topLine, bottomLine, col);
  }

  function getStartCellPolygon() {
    const topLine = getDepthLine(0, viewportSize);
    const bottomLine = getStartCellBottomLine(viewportSize);
    const topCellWidth = topLine.width / BOARD.cols;
    const bottomCellWidth = bottomLine.width / BOARD.cols;
    const centerX = viewportSize.width * 0.5;
    const gap = getBoardGap(viewportSize);

    return [
      centerX - topCellWidth / 2 + gap,
      topLine.y + gap,
      centerX + topCellWidth / 2 - gap,
      topLine.y + gap,
      centerX + bottomCellWidth / 2 - gap,
      bottomLine.y,
      centerX - bottomCellWidth / 2 + gap,
      bottomLine.y
    ];
  }

  function getPerspectiveCellPolygon(
    topLine: ReturnType<typeof getDepthLine>,
    bottomLine: ReturnType<typeof getDepthLine>,
    col: number
  ) {
    const topCellWidth = topLine.width / BOARD.cols;
    const bottomCellWidth = bottomLine.width / BOARD.cols;
    const gap = getBoardGap(viewportSize);

    return [
      topLine.left + col * topCellWidth + gap,
      topLine.y + gap,
      topLine.left + (col + 1) * topCellWidth - gap,
      topLine.y + gap,
      bottomLine.left + (col + 1) * bottomCellWidth - gap,
      bottomLine.y - gap,
      bottomLine.left + col * bottomCellWidth + gap,
      bottomLine.y - gap
    ];
  }

  function getAvailableCells() {
    if (gamePhase !== "playing" || lionCell.row === 0) {
      return [];
    }

    return Array.from({ length: BOARD.cols }, (_, col) => ({
      row: lionCell.row - 1,
      col
    }));
  }

  async function jumpLionToCell(targetRow: number, targetCol: number) {
    const canJumpToTarget = getAvailableCells().some(
      ({ row, col }) => row === targetRow && col === targetCol
    );

    if (!canJumpToTarget) {
      return;
    }

    gamePhase = "checking";
    faceLionToCell(targetCol);
    selectedCell = {
      row: targetRow,
      col: targetCol
    };
    hoveredCell = null;
    renderBoard();

    const { result } = await checkLionRoadCellMock({ row: targetRow, col: targetCol });

    if (isDestroyed || gamePhase !== "checking") {
      return;
    }

    gamePhase = "jumping";
    startLionJumpToCell(targetRow, targetCol, result);
  }

  function startLionJumpToCell(targetRow: number, targetCol: number, checkResult: LionRoadCellCheckResult) {
    const isSpikeTrap = checkResult === "spikes";

    if (isSpikeTrap) {
      activeSpikeCell = {
        row: targetRow,
        col: targetCol
      };
      spikeReveal = 0;
    }

    const fromCameraRow = cameraRow;
    const targetCameraRow =
      getCellDepth(targetRow, fromCameraRow) > CAMERA.followDepth
        ? targetRow + CAMERA.followDepth + 1
        : fromCameraRow;
    const shouldMoveCamera = targetCameraRow !== fromCameraRow;
    const startedAt = performance.now();

    const tick = () => {
      const progress = Math.min((performance.now() - startedAt) / JUMP.durationMs, 1);
      const easedProgress = easeInOut(progress);
      const spikeProgress = isSpikeTrap
        ? clamp((progress - SPIKE_TRAP.jumpRevealStart) / (1 - SPIKE_TRAP.jumpRevealStart), 0, 1)
        : 0;
      const spikeLift = isSpikeTrap
        ? getSpikeLionLandingLift({ row: targetRow, col: targetCol }) * easeInOut(spikeProgress)
        : 0;
      cameraRow = lerp(fromCameraRow, targetCameraRow, easedProgress);
      // Камера едет вместе с прыжком, поэтому цель каждый кадр берется в текущей перспективе.
      const arcOffset = Math.sin(progress * Math.PI) * scaleViewportX(JUMP.arcHeight, viewportSize);
      const projectedFrom = getLionPositionAtCamera(lionCell.row, lionCell.col, cameraRow);
      const projectedTo = getLionPositionAtCamera(targetRow, targetCol, cameraRow);
      const projectedFromZ = getCellRenderZIndex(lionCell);
      const projectedToZ = getCellRenderZIndex({ row: targetRow, col: targetCol });
      const fromLionHeight = getLionHeightAtCamera(lionCell.row, cameraRow, viewportSize);
      const toLionHeight = getLionHeightAtCamera(targetRow, cameraRow, viewportSize);

      setLionHeight(lerp(fromLionHeight, toLionHeight, easedProgress));
      setLionState(getLionStateByJumpProgress(progress));
      lion.position.set(
        lerp(projectedFrom.x, projectedTo.x, easedProgress),
        lerp(projectedFrom.y, projectedTo.y, easedProgress) - arcOffset - spikeLift
      );
      lion.zIndex = lerp(projectedFromZ, projectedToZ, easedProgress) + 1;

      if (isSpikeTrap) {
        spikeReveal = easeInOutCubic(spikeProgress);
        renderSpikeTrap();
      }

      if (shouldMoveCamera) {
        renderBoard();
      }

      if (progress < 1) {
        return;
      }

      app.ticker.remove(tick);
      cameraRow = targetCameraRow;
      const landing = getLionPosition(targetRow, targetCol);

      setLionHeight(getLionHeightAtCamera(targetRow, cameraRow, viewportSize));
      lion.position.set(
        landing.x,
        landing.y - (isSpikeTrap ? getSpikeLionLandingLift({ row: targetRow, col: targetCol }) : 0)
      );
      lionCell = {
        row: targetRow,
        col: targetCol
      };
      spikeReveal = isSpikeTrap ? 1 : spikeReveal;
      selectedCell =
        checkResult !== "safe"
          ? {
              row: targetRow,
              col: targetCol
            }
          : null;
      renderBoard();

      if (checkResult === "fall") {
        void playFallSequence(targetRow, targetCol);
        return;
      }

      if (checkResult === "spikes") {
        void playSpikeSequence(targetRow, targetCol);
        return;
      }

      finishJump();
    };

    app.ticker.add(tick);
  }

  function finishJump() {
    landTimer = window.setTimeout(() => {
      gamePhase = "playing";
      renderBoard();

      if (lionCell.row === 0) {
        playFinalLionAnimation();
        return;
      }

      setLionState("idle");
    }, JUMP.landMs);
  }

  async function playFallSequence(targetRow: number, targetCol: number) {
    gamePhase = "trapResolving";
    renderBoard();
    await sleep(JUMP.landMs);

    if (isDestroyed || gamePhase !== "trapResolving") {
      return;
    }

    const targetCell = findBoardCell(targetRow, targetCol);

    if (targetCell) {
      await playTileFall(targetCell.tile, targetCol);
    }

    if (isDestroyed || gamePhase !== "trapResolving") {
      return;
    }

    await playLionFall();

    if (isDestroyed || gamePhase !== "trapResolving") {
      return;
    }

    finishTrapGameOver();
  }

  async function playSpikeSequence(targetRow: number, targetCol: number) {
    gamePhase = "trapResolving";
    activeSpikeCell = {
      row: targetRow,
      col: targetCol
    };
    spikeReveal = 1;
    renderBoard();

    if (isDestroyed || gamePhase !== "trapResolving") {
      return;
    }

    await playLionSpikeExplosion();

    if (isDestroyed || gamePhase !== "trapResolving") {
      return;
    }

    lion.visible = false;
    lion.alpha = 1;
    lion.rotation = 0;
    finishTrapGameOver();
  }

  function playLionSpikeExplosion() {
    return new Promise<void>((resolve) => {
      window.clearTimeout(lionExplosionTimer);
      lion.visible = true;
      lion.alpha = 1;
      lion.rotation = 0;
      syncLionZIndex();
      playLionExplosion(resolve, SPIKE_TRAP.explosionFrameMs);
    });
  }

  function finishTrapGameOver() {
    selectedCell = null;
    hoveredCell = null;
    gamePhase = "gameOver";
    renderBoard();
    gameOverUi?.show();
  }

  async function playTileFall(tile: PerspectiveGridTile, targetCol: number) {
    const shakeOffset = scaleViewportX(FALL.tileShakeOffsetPx, viewportSize);
    const centerCol = Math.floor(BOARD.cols / 2);
    const driftDirection = targetCol === centerCol ? lionDirection : targetCol < centerCol ? -1 : 1;

    await animateWithTicker(FALL.tileShakeMs, (progress) => {
      const strength = 1 - progress;
      const shake = Math.sin(progress * Math.PI * 12) * strength;

      tile.setFallTransform({
        offsetX: shake * shakeOffset,
        offsetY: Math.cos(progress * Math.PI * 14) * strength * shakeOffset * 0.35,
        rotation: shake * 0.035
      });
    });

    if (isDestroyed || gamePhase !== "trapResolving") {
      return;
    }

    await animateWithTicker(FALL.tileFallMs, (progress) => {
      const fallProgress = progress * progress;

      tile.setFallTransform({
        alpha: 1 - progress * 0.35,
        offsetX: scaleViewportX(FALL.tileFallDriftPx, viewportSize) * driftDirection * easeInOut(progress),
        offsetY: (viewportSize.height + scaleViewportX(FALL.tileFallOverscanPx, viewportSize)) * fallProgress,
        rotation: FALL.tileFallRotation * driftDirection * easeInOut(progress)
      });
    });
  }

  async function playLionFall() {
    const startX = lion.x;
    const startY = lion.y;
    const fallDistance = viewportSize.height - startY + scaleViewportX(FALL.lionFallOverscanPx, viewportSize);

    lion.zIndex = getCellRenderZIndex(lionCell) - 1;
    setLionState("fallStart");
    await sleep(FALL.lionStartFrameMs);

    if (isDestroyed || gamePhase !== "trapResolving") {
      return;
    }

    setLionState("fallStrong");
    await sleep(FALL.lionStrongFrameMs);

    if (isDestroyed || gamePhase !== "trapResolving") {
      return;
    }

    await animateWithTicker(FALL.lionFallMs, (progress) => {
      const frameIndex = Math.floor((progress * FALL.lionFallMs) / FALL.lionFrameMs) % lionFallLoopStates.length;
      const fallProgress = progress * progress;

      setLionState(lionFallLoopStates[frameIndex]);
      lion.position.set(
        startX + Math.sin(progress * Math.PI * 1.4) * scaleViewportX(FALL.lionFallDriftPx, viewportSize) * lionDirection,
        startY + fallDistance * fallProgress
      );
      lion.rotation = lionDirection * 0.14 * easeInOut(progress);
      lion.alpha = 1 - progress * 0.12;
    });

    lion.visible = false;
    lion.alpha = 1;
    lion.rotation = 0;
  }

  function findBoardCell(row: number, col: number) {
    return boardCells.find((cell) => cell.row === row && cell.col === col);
  }

  function animateWithTicker(durationMs: number, onFrame: (progress: number) => void) {
    return new Promise<void>((resolve) => {
      const startedAt = performance.now();

      const tick = () => {
        if (isDestroyed) {
          app.ticker.remove(tick);
          resolve();
          return;
        }

        const progress = clamp((performance.now() - startedAt) / durationMs, 0, 1);

        onFrame(progress);

        if (progress < 1) {
          return;
        }

        app.ticker.remove(tick);
        resolve();
      };

      app.ticker.add(tick);
      tick();
    });
  }

  function resetGame() {
    if (gamePhase === "checking" || gamePhase === "jumping" || gamePhase === "trapResolving") {
      return;
    }

    restartScene();
  }

  function restartScene() {
    window.clearTimeout(landTimer);
    gamePhase = "playing";
    lionCell = { ...START_CELL };
    cameraRow = START_CELL.row;
    lionDirection = 1;
    selectedCell = null;
    activeSpikeCell = null;
    hoveredCell = null;
    spikeReveal = 0;
    boardCells.forEach(({ tile }) => tile.resetFallTransform());
    spikeTrap.hide();
    gameOverUi?.hide();
    clearFinalLionAnimation();
    lion.visible = true;
    lion.alpha = 1;
    lion.rotation = 0;
    setLionState("idle");
    resetLionPosition();
    renderBoard();
  }

  function resetLionPosition() {
    const start = getLionPosition(START_CELL.row, START_CELL.col);

    setLionHeight(getLionHeightAtCamera(START_CELL.row, cameraRow, viewportSize));
    lion.position.set(start.x, start.y);
    syncLionZIndex();
  }

  function syncLionZIndex(cell: Cell = lionCell) {
    lion.zIndex = getCellRenderZIndex(cell) + 1;
  }

  function getSpikeLionLandingLift(cell: Cell) {
    return (
      getTileScreenHeight(getCellQuadFromPolygon(getCellPolygon(cell.row, cell.col))) *
      SPIKE_TRAP.lionLandingLiftRatio
    );
  }

  function faceLionToCell(targetCol: number) {
    if (targetCol === lionCell.col) {
      return;
    }

    lionDirection = targetCol > lionCell.col ? 1 : -1;
    resizeLion(lion, lionDirection, lionHeight);
  }

  function setLionHeight(height: number) {
    lionHeight = height;
    resizeLion(lion, lionDirection, lionHeight);
  }

  function playFinalLionAnimation() {
    clearFinalLionAnimation();
    lionDirection = 1;
    resizeLion(lion, lionDirection, lionHeight);

    if (FINAL_LION.shouldPlayExplosionBeforeCelebration) {
      playLionExplosion(playFinalLionCelebration);
      return;
    }

    playFinalLionCelebration();
  }

  function playLionExplosion(onComplete: () => void, frameMs: number = FINAL_LION.explosionFrameMs) {
    let frame = 0;

    const renderExplosionFrame = () => {
      const state = lionExplosionStates[frame];

      setLionState(state);
      frame += 1;

      if (frame < lionExplosionStates.length) {
        lionExplosionTimer = window.setTimeout(renderExplosionFrame, frameMs);
        return;
      }

      onComplete();
    };

    renderExplosionFrame();
  }

  function playFinalLionCelebration() {
    let frame = 0;

    const renderReversalFrame = () => {
      const state = lionReversalStates[frame];

      setLionState(state);
      frame += 1;

      if (frame < lionReversalStates.length) {
        lionReversalTimer = window.setTimeout(renderReversalFrame, FINAL_LION.reversalFrameMs);
        return;
      }

      playJoyJumpLoop();
    };

    renderReversalFrame();
  }

  function playJoyJumpLoop() {
    let frame = 0;
    joyJumpBaseY = lion.y;

    const renderJoyJumpFrame = () => {
      const state = lionJoyJumpStates[frame];

      setLionState(state);
      lion.y = joyJumpBaseY - scaleViewportX(lionJoyJumpOffsets[state], viewportSize);
      frame = (frame + 1) % lionJoyJumpStates.length;
    };

    renderJoyJumpFrame();
    lionJoyJumpTimer = window.setInterval(renderJoyJumpFrame, FINAL_LION.joyJumpFrameMs);
  }

  function clearFinalLionAnimation() {
    window.clearTimeout(lionExplosionTimer);
    window.clearTimeout(lionReversalTimer);
    window.clearInterval(lionJoyJumpTimer);
  }

  function handleResetKey(event: KeyboardEvent) {
    if (event.key.toLowerCase() === "r") {
      resetGame();
    }
  }

  function handleResize() {
    const nextViewportSize = getHostViewportSize(pixiHost);

    if (nextViewportSize.width === viewportSize.width && nextViewportSize.height === viewportSize.height) {
      return;
    }

    viewportSize = nextViewportSize;
    app.renderer.resize(viewportSize.width, viewportSize.height);
    syncLionPositionToCell();
    renderBoard();
    gameOverUi?.updateLayout();
  }

  function syncLionPositionToCell() {
    const position = getLionPosition(lionCell.row, lionCell.col);
    const spikeLift =
      activeSpikeCell?.row === lionCell.row && activeSpikeCell.col === lionCell.col
        ? getSpikeLionLandingLift(lionCell) * clamp(spikeReveal, 0, 1)
        : 0;

    setLionHeight(getLionHeightAtCamera(lionCell.row, cameraRow, viewportSize));
    lion.position.set(position.x, position.y - spikeLift);
    syncLionZIndex();
    joyJumpBaseY = position.y;
  }

  function updateSlowCameraDebug() {
    if (gamePhase !== "playing") {
      return;
    }

    const phase = ((performance.now() % SLOW_GRID_CAMERA.periodMs) / SLOW_GRID_CAMERA.periodMs) * Math.PI * 2;
    const progress = (Math.sin(phase - Math.PI / 2) + 1) / 2;

    cameraRow = lerp(START_CELL.row, START_CELL.row - SLOW_GRID_CAMERA.rowTravel, easeInOutCubic(progress));
    syncLionPositionToCell();
    renderBoard();
  }

  function updateCellGlows() {
    const timeMs = performance.now();

    boardCells.forEach(({ tile }) => tile.renderGlow(timeMs));
  }

  function setHoveredCell(cell: Cell | null) {
    if (hoveredCell?.row === cell?.row && hoveredCell?.col === cell?.col) {
      return;
    }

    hoveredCell = cell;
    renderBoard();
  }

  function renderBoard() {
    const availableCells = getAvailableCells();

    updateEnvironmentLayout();

    boardCells.forEach((cell) => {
      const isVisible = getCellDepth(cell.row, cameraRow) >= -BOARD.backRows;
      const availableIndex = availableCells.findIndex(({ row, col }) => row === cell.row && col === cell.col);
      const isAvailable = availableIndex !== -1;
      const isCurrent = gamePhase !== "gameOver" && lionCell.row === cell.row && lionCell.col === cell.col;
      const isHovered = isAvailable && hoveredCell?.row === cell.row && hoveredCell.col === cell.col;
      const isSelected = selectedCell?.row === cell.row && selectedCell.col === cell.col;
      const polygon = getCellPolygon(cell.row, cell.col);
      const quad = getCellQuadFromPolygon(polygon);
      const isBelowViewport = polygon[1] > viewportSize.height;

      if (!isVisible || isBelowViewport) {
        cell.tile.hide();
        return;
      }

      cell.tile.setState(isSelected ? "SELECTED" : "CLOSED");
      cell.tile.updateGeometry({
        ...quad,
        depth: getCellPositionAtCamera(cell.row, cell.col, cameraRow).y,
        maxThicknessPx: getCellFrontMaxThickness(cell, quad)
      });
      cell.tile.setInteractive(isAvailable);
      cell.tile.setGlowState(isAvailable, isCurrent, availableIndex, isHovered || isSelected);
    });
    renderSpikeTrap();
  }

  function renderSpikeTrap() {
    if (!activeSpikeCell) {
      spikeTrap.hide();
      return;
    }

    const polygon = getCellPolygon(activeSpikeCell.row, activeSpikeCell.col);
    const isVisible = getCellDepth(activeSpikeCell.row, cameraRow) >= -BOARD.backRows;

    if (!isVisible || polygon[1] > viewportSize.height) {
      spikeTrap.hide();
      return;
    }

    spikeTrap.updateGeometry(
      getCellQuadFromPolygon(polygon),
      spikeReveal,
      getCellRenderZIndex(activeSpikeCell) + SPIKE_TRAP.zIndexOffset
    );
  }

  function getCellFrontMaxThickness(cell: Cell, quad: CellQuad) {
    const lowerCell = getLowerCell(cell);

    if (!lowerCell) {
      return undefined;
    }

    const lowerQuad = getCellQuadFromPolygon(getCellPolygon(lowerCell.row, lowerCell.col));
    const lowerTopY = Math.min(lowerQuad.topLeft.y, lowerQuad.topRight.y);
    const currentBottomY = Math.max(quad.bottomLeft.y, quad.bottomRight.y);

    return Math.max(lowerTopY - currentBottomY - GRID_TILE.frontLowerGapPx, 0);
  }

  function getCellRenderZIndex(cell: Cell) {
    const quad = getCellQuadFromPolygon(getCellPolygon(cell.row, cell.col));
    const tileThicknessPx = getTileScreenHeight(quad) * GRID_TILE.thicknessRatio;
    const maxThicknessPx = getCellFrontMaxThickness(cell, quad);
    const thicknessPx =
      maxThicknessPx === undefined ? tileThicknessPx : Math.min(tileThicknessPx, maxThicknessPx);

    return Math.max(getCellDepth(cell.row, cameraRow), quad.bottomLeft.y, quad.bottomRight.y) + thicknessPx;
  }

  function getLowerCell(cell: Cell): Cell | null {
    const lowerRow = cell.row + 1;

    if (lowerRow < BOARD.rows) {
      return {
        row: lowerRow,
        col: cell.col
      };
    }

    if (lowerRow === BOARD.rows && cell.col === START_CELL.col) {
      return START_CELL;
    }

    return null;
  }

  function updateEnvironmentLayout() {
    const roadEndY = getDepthLine(cameraRow, viewportSize).y;
    const voidTopY = roadEndY + ENVIRONMENT_CONFIG.void.roadEndOffset;
    const skyCoverHeight = Math.max(roadEndY, 1);
    const voidCoverHeight = viewportSize.height - voidTopY + ENVIRONMENT_CONFIG.void.bottomOverscan;

    coverSpriteToArea(environment.sky, viewportSize.width, skyCoverHeight);
    environment.sky.position.set(viewportSize.width * 0.5, roadEndY);
    coverSpriteToArea(environment.void, viewportSize.width, voidCoverHeight);
    environment.void.position.set(viewportSize.width * 0.5, voidTopY);
    updateIslandLayout(environment.island, environment.castle, environment.rock, roadEndY);
  }

  function updateIslandLayout(island: Container, castle: Sprite, rock: Sprite, roadEndY: number) {
    const widthMultiplier = getEnvironmentWidthMultiplier();
    const bottomY = roadEndY + ENVIRONMENT_CONFIG.castle.roadEndOffset;
    const scale = Math.max(
      (viewportSize.width / castle.texture.width) * widthMultiplier,
      (viewportSize.width / rock.texture.width) * ENVIRONMENT_CONFIG.rock.minWidthMultiplier
    );
    island.scale.set(scale);
    island.position.set(viewportSize.width * 0.5, bottomY);
  }

  function getEnvironmentWidthMultiplier() {
    const normalizedProgress = clamp(
      getCameraProgress(cameraRow) / ENVIRONMENT_CONFIG.castle.maxProgress,
      0,
      1
    );
    const easedProgress = easeInOutCubic(normalizedProgress);

    return lerp(
      ENVIRONMENT_CONFIG.castle.startWidthMultiplier,
      ENVIRONMENT_CONFIG.castle.endWidthMultiplier,
      easedProgress
    );
  }

  return destroy;
}

async function checkLionRoadCellMock(cell: Cell): Promise<LionRoadCellCheckResponse> {
  void cell;

  await sleep(CELL_CHECK_MOCK.delayMs);

  if (Math.random() >= CELL_CHECK_MOCK.trapChance) {
    return {
      result: "safe"
    };
  }

  return {
    result: Math.random() < 0.5 ? "fall" : "spikes"
  };
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function loadLionTextures(): Promise<LionTextures> {
  const entries = await Promise.all(
    Object.entries(lionTextureUrls).map(async ([state, url]) => {
      const texture = await Assets.load<Texture>(url);

      return [state, texture] as const;
    })
  );

  return Object.fromEntries(entries) as LionTextures;
}

async function loadEnvironmentTextures(): Promise<EnvironmentTextures> {
  const [sky, voidTexture, castle, rock] = await Promise.all([
    Assets.load<Texture>(skyUrl),
    Assets.load<Texture>(voidUrl),
    Assets.load<Texture>(environmentCastleUrl),
    Assets.load<Texture>(rockUrl)
  ]);

  return {
    castle,
    rock,
    sky,
    void: voidTexture
  };
}

async function loadGridTextures(): Promise<GridTextures> {
  const [top, front] = await Promise.all([
    Assets.load<Texture>(gridTopUrl),
    Assets.load<Texture>(gridFrontUrl)
  ]);

  configureGridTexture(top);
  configureGridTexture(front);

  return {
    front,
    top
  };
}

async function loadSpikeTexture() {
  const texture = await Assets.load<Texture>(spikeMetalUrl);

  configureGridTexture(texture);

  return texture;
}

function configureGridTexture(texture: Texture) {
  const { source } = texture;

  source.autoGenerateMipmaps = true;
  source.scaleMode = "linear";
  source.mipmapFilter = "linear";
  source.maxAnisotropy = GRID_TEXTURE.maxAnisotropy;
  source.style.update();
  source.unload();
}

function getGridTileDebugEnabled() {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).has("debugGrid");
}

function getGridSlowCameraDebugEnabled() {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).has("slowGridCamera");
}

function getDepthLine(depth: number, viewportSize: ViewportSize) {
  if (depth < 0) {
    const nearLine = getForwardDepthLine(0, viewportSize);
    const backLine = getBackDepthLine(viewportSize);
    const progress = clamp(Math.abs(depth) / BOARD.backRows, 0, 1);
    const width = lerp(nearLine.width, backLine.width, progress);
    const y = lerp(nearLine.y, backLine.y, progress);

    return getDepthLineBySize(width, y, viewportSize);
  }

  return getForwardDepthLine(depth, viewportSize);
}

function getForwardDepthLine(depth: number, viewportSize: ViewportSize) {
  const progress = Math.pow(clamp(depth / BOARD.rows, 0, 1), BOARD.depthPower);
  const width = lerp(
    scaleViewportX(BOARD.nearWidth, viewportSize),
    scaleViewportX(BOARD.farWidth, viewportSize),
    progress
  );

  return getDepthLineBySize(
    width,
    lerp(scaleViewportY(BOARD.nearY, viewportSize), scaleViewportY(BOARD.farY, viewportSize), progress),
    viewportSize
  );
}

function getBackDepthLine(viewportSize: ViewportSize) {
  const nearLine = getForwardDepthLine(0, viewportSize);
  const nextLine = getForwardDepthLine(1, viewportSize);
  const y = scaleViewportY(BOARD.backY, viewportSize);
  const progress = (y - nearLine.y) / (nearLine.y - nextLine.y);
  const width = nearLine.width + (nearLine.width - nextLine.width) * progress;

  return getDepthLineBySize(width, y, viewportSize);
}

function getDepthLineBySize(width: number, y: number, viewportSize: ViewportSize) {
  return {
    left: viewportSize.width * 0.5 - width / 2,
    width,
    y
  };
}

function getCellDepth(row: number, currentCameraRow: number) {
  return currentCameraRow - row - 1;
}

function getLionHeightAtCamera(row: number, currentCameraRow: number, viewportSize: ViewportSize) {
  const depth = row === BOARD.rows ? 0 : getCellDepth(row, currentCameraRow);
  const depthLine = getDepthLine(depth, viewportSize);
  const sceneScale = getSceneScale(viewportSize);

  return clamp(
    LION_HEIGHT * sceneScale * (depthLine.width / scaleViewportX(BOARD.nearWidth, viewportSize)),
    70 * sceneScale,
    LION_HEIGHT * sceneScale
  );
}

function getLionCellOffsetY(row: number, viewportSize: ViewportSize) {
  if (row !== 0) {
    return 0;
  }

  return scaleViewportX(FINAL_LION.lastCellOffsetY, viewportSize);
}

function getHostViewportSize(host: HTMLDivElement): ViewportSize {
  const rect = host.getBoundingClientRect();

  return {
    width: Math.max(Math.round(rect.width) || CANVAS.width, 1),
    height: Math.max(Math.round(rect.height) || CANVAS.height, 1)
  };
}

function getStartCellBottomY(viewportSize: ViewportSize) {
  return scaleViewportY(BOARD.floorY, viewportSize) - getBoardGap(viewportSize);
}

function getStartCellBottomLine(viewportSize: ViewportSize) {
  const topLine = getDepthLine(0, viewportSize);
  const backLine = getBackDepthLine(viewportSize);
  const bottomY = getStartCellBottomY(viewportSize);
  const progress = clamp((bottomY - topLine.y) / (backLine.y - topLine.y), 0, 1);
  const width = lerp(topLine.width, backLine.width, progress);

  return {
    left: viewportSize.width * 0.5 - width / 2,
    width,
    y: bottomY
  };
}

function getCellQuadFromPolygon(polygon: number[]): CellQuad {
  return {
    topLeft: {
      x: polygon[0],
      y: polygon[1]
    },
    topRight: {
      x: polygon[2],
      y: polygon[3]
    },
    bottomRight: {
      x: polygon[4],
      y: polygon[5]
    },
    bottomLeft: {
      x: polygon[6],
      y: polygon[7]
    }
  };
}

function getCellQuadPolygon({ bottomLeft, bottomRight, topLeft, topRight }: CellQuad) {
  return [
    topLeft.x,
    topLeft.y,
    topRight.x,
    topRight.y,
    bottomRight.x,
    bottomRight.y,
    bottomLeft.x,
    bottomLeft.y
  ];
}

function getTileScreenHeight({ bottomLeft, bottomRight, topLeft, topRight }: CellQuad) {
  return (getDistance(topLeft, bottomLeft) + getDistance(topRight, bottomRight)) / 2;
}

function getDistance(from: ScreenPoint, to: ScreenPoint) {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

function getMidpoint(from: ScreenPoint, to: ScreenPoint): ScreenPoint {
  return {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2
  };
}

function getNormalizedVector(vector: ScreenPoint): ScreenPoint {
  const length = Math.hypot(vector.x, vector.y) || 1;

  return {
    x: vector.x / length,
    y: vector.y / length
  };
}

function getPolygonCenter(polygon: number[]) {
  let doubleArea = 0;
  let x = 0;
  let y = 0;

  for (let index = 0; index < polygon.length; index += 2) {
    const nextIndex = (index + 2) % polygon.length;
    const currentX = polygon[index];
    const currentY = polygon[index + 1];
    const nextX = polygon[nextIndex];
    const nextY = polygon[nextIndex + 1];
    const cross = currentX * nextY - nextX * currentY;

    doubleArea += cross;
    x += (currentX + nextX) * cross;
    y += (currentY + nextY) * cross;
  }

  if (doubleArea === 0) {
    return {
      x: polygon[0],
      y: polygon[1]
    };
  }

  return {
    x: x / (3 * doubleArea),
    y: y / (3 * doubleArea)
  };
}

function coverSpriteToArea(sprite: Sprite, viewportWidth: number, areaHeight: number) {
  const scale = Math.max(viewportWidth / sprite.texture.width, areaHeight / sprite.texture.height);

  sprite.scale.set(scale);
}

function scaleViewportX(value: number, viewportSize: ViewportSize) {
  return value * getSceneScale(viewportSize);
}

function scaleViewportY(value: number, viewportSize: ViewportSize) {
  return getSceneOffsetY(viewportSize) + value * getSceneScale(viewportSize);
}

function getSceneScale(viewportSize: ViewportSize) {
  return Math.min(viewportSize.width / CANVAS.width, viewportSize.height / CANVAS.height);
}

function getSceneOffsetY(viewportSize: ViewportSize) {
  return Math.max((viewportSize.height - CANVAS.height * getSceneScale(viewportSize)) / 2, 0);
}

function getBoardGap(viewportSize: ViewportSize) {
  return scaleViewportX(BOARD.gap, viewportSize);
}

function getCameraProgress(cameraRow: number) {
  return START_CELL.row - cameraRow;
}

function resizeLion(lion: Sprite, direction: LionDirection, height: number) {
  const scale = height / lion.texture.height;

  lion.scale.set(scale * direction, scale);
}

function getLionStateByJumpProgress(progress: number): LionState {
  if (progress < 0.15) {
    return "prepare";
  }

  if (progress < 0.28) {
    return "takeoff";
  }

  if (progress < 0.86) {
    return "air";
  }

  return "land";
}

function easeInOut(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
