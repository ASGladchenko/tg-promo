import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState
} from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import mineArchImage from "@/shared/images/miner/miner-arch.webp";
import mineAztecImage from "@/shared/images/miner/miner-aztec.webp";
import mineBgImage from "@/shared/images/miner/miner-bg.webp";
import mineCompassImage from "@/shared/images/miner/miner-compass.webp";
import mineGasLampImage from "@/shared/images/miner/miner-gas-lamp.webp";
import mineMeshImage from "@/shared/images/miner/miner-mesh.webp";
import mineSandImage from "@/shared/images/miner/miner-sand.webp";
import mineStoneImage from "@/shared/images/miner/miner-stone.webp";
import mineToolsImage from "@/shared/images/miner/miner-tools.webp";
import mineTrolleyImage from "@/shared/images/miner/miner-trolley.webp";
import mineWallImage from "@/shared/images/miner/miner-wall.webp";

import "./mine-scene.scss";

export type MineSceneCellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type MineSceneZoneKind = "gold" | "ruby";

export type MineSceneZone = {
  cellIndex: MineSceneCellIndex;
  kind: MineSceneZoneKind;
  radius: number;
  x: number;
  y: number;
};

export type MineSceneCellClick = {
  cellHeight: number;
  cellIndex: MineSceneCellIndex;
  cellWidth: number;
  cellX: number;
  cellY: number;
  sceneX: number;
  sceneY: number;
};

type MineSceneCellRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type MineSceneDrawRect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

type MineSceneImages = {
  background: HTMLImageElement;
  cells: readonly HTMLImageElement[];
  mesh: HTMLImageElement;
};

type MineScenePendingPointer = {
  pointerId: number;
  pointerType: string;
  startedAt: number;
  startX: number;
  startY: number;
};

type MineSceneProps = {
  activeZones?: readonly MineSceneZone[];
  className?: string;
  countdownLabel?: string | null;
  disabledCellIndexes?: readonly MineSceneCellIndex[];
  onCellClick?: (cellClick: MineSceneCellClick) => void;
  selectedCellIndexes?: readonly MineSceneCellIndex[];
};

const BOARD_ASPECT_RATIO = 479 / 521;
const BOARD_DESKTOP_WIDTH_RATIO = 0.76;
const BOARD_MOBILE_WIDTH_RATIO = 0.82;
const BOARD_MAX_WIDTH = 440;
const MOBILE_WIDTH_BREAKPOINT = 420;
const CELL_DRAW_PADDING = 0.004;
const PAGE_BACKGROUND_COLOR = "rgb(18 16 13)";
const PAGE_BACKGROUND_RGB = "18, 16, 13";
const EMPTY_MINE_SCENE_CELL_INDEXES: readonly MineSceneCellIndex[] = [];
const EMPTY_MINE_SCENE_ZONES: readonly MineSceneZone[] = [];
const MINE_SCENE_ALLOWED_POINTER_TYPES = new Set(["mouse", "pen", "touch"]);
const MINE_SCENE_MAX_TAP_DURATION_MS = 850;
const MINE_SCENE_MAX_TAP_MOVE_PX = 24;

const MINE_SCENE_CELL_IMAGES = [
  mineWallImage,
  mineStoneImage,
  mineSandImage,
  mineArchImage,
  mineAztecImage,
  mineToolsImage,
  mineGasLampImage,
  mineCompassImage,
  mineTrolleyImage
] as const;

const MINE_SCENE_CELL_RECTS: readonly MineSceneCellRect[] = [
  { left: 0.1002, top: 0.1017, width: 0.2401, height: 0.2322 },
  { left: 0.38, top: 0.1036, width: 0.2401, height: 0.2303 },
  { left: 0.6576, top: 0.0998, width: 0.2359, height: 0.2342 },
  { left: 0.1023, top: 0.3724, width: 0.238, height: 0.2457 },
  { left: 0.38, top: 0.3743, width: 0.238, height: 0.2457 },
  { left: 0.6597, top: 0.3724, width: 0.2338, height: 0.2457 },
  { left: 0.1023, top: 0.6583, width: 0.238, height: 0.2457 },
  { left: 0.38, top: 0.6622, width: 0.238, height: 0.2399 },
  { left: 0.6576, top: 0.6564, width: 0.2359, height: 0.2457 }
] as const;

function loadMineSceneImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load mine scene image: ${src}`));
    image.src = src;
  });
}

async function loadMineSceneImages(): Promise<MineSceneImages> {
  const [background, mesh, ...cells] = await Promise.all([
    loadMineSceneImage(mineBgImage),
    loadMineSceneImage(mineMeshImage),
    ...MINE_SCENE_CELL_IMAGES.map((cellImage) => loadMineSceneImage(cellImage))
  ]);

  return {
    background,
    cells,
    mesh
  };
}

function getMineSceneBoardRect(stageWidth: number, stageHeight: number): MineSceneDrawRect {
  const boardWidthRatio =
    stageWidth <= MOBILE_WIDTH_BREAKPOINT ? BOARD_MOBILE_WIDTH_RATIO : BOARD_DESKTOP_WIDTH_RATIO;
  const boardWidth = Math.min(stageWidth * boardWidthRatio, BOARD_MAX_WIDTH);
  const boardHeight = boardWidth / BOARD_ASPECT_RATIO;

  return {
    height: boardHeight,
    width: boardWidth,
    x: (stageWidth - boardWidth) / 2,
    y: (stageHeight - boardHeight) / 2
  };
}

function getMineSceneCellRect(
  boardRect: MineSceneDrawRect,
  cellRect: MineSceneCellRect,
  padding = 0
): MineSceneDrawRect {
  const left = cellRect.left - padding;
  const top = cellRect.top - padding;
  const width = cellRect.width + padding * 2;
  const height = cellRect.height + padding * 2;

  return {
    height: height * boardRect.height,
    width: width * boardRect.width,
    x: boardRect.x + left * boardRect.width,
    y: boardRect.y + top * boardRect.height
  };
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  rect: MineSceneDrawRect
) {
  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;

  if (!imageWidth || !imageHeight) {
    return;
  }

  const scale = Math.max(rect.width / imageWidth, rect.height / imageHeight);
  const sourceWidth = rect.width / scale;
  const sourceHeight = rect.height / scale;
  const sourceX = (imageWidth - sourceWidth) / 2;
  const sourceY = (imageHeight - sourceHeight) / 2;

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    rect.x,
    rect.y,
    rect.width,
    rect.height
  );
}

function drawMineSceneEdgeFade(context: CanvasRenderingContext2D, width: number, height: number) {
  const horizontalGradient = context.createLinearGradient(0, 0, width, 0);
  horizontalGradient.addColorStop(0, PAGE_BACKGROUND_COLOR);
  horizontalGradient.addColorStop(0.06, `rgba(${PAGE_BACKGROUND_RGB}, 0.72)`);
  horizontalGradient.addColorStop(0.18, `rgba(${PAGE_BACKGROUND_RGB}, 0)`);
  horizontalGradient.addColorStop(0.82, `rgba(${PAGE_BACKGROUND_RGB}, 0)`);
  horizontalGradient.addColorStop(0.94, `rgba(${PAGE_BACKGROUND_RGB}, 0.72)`);
  horizontalGradient.addColorStop(1, PAGE_BACKGROUND_COLOR);

  context.fillStyle = horizontalGradient;
  context.fillRect(0, 0, width, height);

  const verticalGradient = context.createLinearGradient(0, 0, 0, height);
  verticalGradient.addColorStop(0, PAGE_BACKGROUND_COLOR);
  verticalGradient.addColorStop(0.08, `rgba(${PAGE_BACKGROUND_RGB}, 0.62)`);
  verticalGradient.addColorStop(0.2, `rgba(${PAGE_BACKGROUND_RGB}, 0)`);
  verticalGradient.addColorStop(0.78, `rgba(${PAGE_BACKGROUND_RGB}, 0)`);
  verticalGradient.addColorStop(0.92, `rgba(${PAGE_BACKGROUND_RGB}, 0.7)`);
  verticalGradient.addColorStop(1, PAGE_BACKGROUND_COLOR);

  context.fillStyle = verticalGradient;
  context.fillRect(0, 0, width, height);

  const outerRadius = Math.max(width, height) * 0.72;
  const innerRadius = Math.min(width, height) * 0.3;
  const radialGradient = context.createRadialGradient(
    width / 2,
    height / 2,
    innerRadius,
    width / 2,
    height / 2,
    outerRadius
  );
  radialGradient.addColorStop(0, `rgba(${PAGE_BACKGROUND_RGB}, 0)`);
  radialGradient.addColorStop(0.68, `rgba(${PAGE_BACKGROUND_RGB}, 0)`);
  radialGradient.addColorStop(0.86, `rgba(${PAGE_BACKGROUND_RGB}, 0.48)`);
  radialGradient.addColorStop(1, PAGE_BACKGROUND_COLOR);

  context.fillStyle = radialGradient;
  context.fillRect(0, 0, width, height);
}

function drawMineSceneSelection(context: CanvasRenderingContext2D, cellRect: MineSceneDrawRect) {
  context.save();
  context.lineWidth = 2;
  context.strokeStyle = "rgba(255, 241, 198, 0.78)";
  context.strokeRect(cellRect.x + 2, cellRect.y + 2, cellRect.width - 4, cellRect.height - 4);
  context.restore();
}

function drawMineSceneZone(
  context: CanvasRenderingContext2D,
  boardRect: MineSceneDrawRect,
  zone: MineSceneZone,
  frameTimeMs: number
) {
  const cellRect = getMineSceneCellRect(boardRect, MINE_SCENE_CELL_RECTS[zone.cellIndex]);
  const zoneX = cellRect.x + zone.x * cellRect.width;
  const zoneY = cellRect.y + zone.y * cellRect.height;
  const zoneRadius = Math.min(cellRect.width, cellRect.height) * zone.radius;
  const pulse = (Math.sin(frameTimeMs / 220) + 1) / 2;
  const ringPulse = (frameTimeMs % 900) / 900;
  const outerRadius = zoneRadius * (1.24 + pulse * 0.22);
  const ringRadius = zoneRadius * (1.14 + ringPulse * 0.78);
  const ringAlpha = 0.56 * (1 - ringPulse);
  const zoneFill =
    zone.kind === "ruby" ? "rgba(255, 66, 116, 0.32)" : "rgba(247, 169, 29, 0.3)";
  const zoneStroke =
    zone.kind === "ruby" ? "rgba(255, 198, 218, 0.9)" : "rgba(255, 241, 198, 0.92)";
  const zoneGlow =
    zone.kind === "ruby" ? "rgba(255, 66, 116, 0.22)" : "rgba(247, 169, 29, 0.2)";
  const zoneRing =
    zone.kind === "ruby"
      ? `rgba(255, 198, 218, ${ringAlpha})`
      : `rgba(255, 241, 198, ${ringAlpha})`;

  context.save();

  context.beginPath();
  context.arc(zoneX, zoneY, outerRadius, 0, Math.PI * 2);
  context.fillStyle = zoneGlow;
  context.fill();

  context.beginPath();
  context.arc(zoneX, zoneY, ringRadius, 0, Math.PI * 2);
  context.lineWidth = Math.max(2, zoneRadius * 0.12);
  context.strokeStyle = zoneRing;
  context.stroke();

  context.beginPath();
  context.arc(zoneX, zoneY, zoneRadius, 0, Math.PI * 2);
  context.fillStyle = zoneFill;
  context.fill();

  context.lineWidth = Math.max(2, zoneRadius * 0.1);
  context.strokeStyle = zoneStroke;
  context.stroke();

  context.restore();
}

function drawMineSceneCountdownLabel(context: CanvasRenderingContext2D, width: number, height: number, label: string) {
  const fontSize = Math.round(Math.min(width, height) * 0.19);

  context.save();
  context.font = `900 ${fontSize}px "Trebuchet MS", "Segoe UI", sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineJoin = "round";
  context.shadowColor = "rgba(0, 0, 0, 0.72)";
  context.shadowBlur = 20;
  context.shadowOffsetY = 5;
  context.strokeStyle = "rgba(0, 0, 0, 0.74)";
  context.lineWidth = Math.max(8, fontSize * 0.08);
  context.strokeText(label, width / 2, height / 2);
  context.fillStyle = "rgba(255, 241, 198, 0.96)";
  context.fillText(label, width / 2, height / 2);
  context.restore();
}

function resizeMineSceneCanvas(canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  const pixelRatio = Math.max(window.devicePixelRatio || 1, 1);
  const width = Math.max(1, bounds.width);
  const height = Math.max(1, bounds.height);
  const canvasWidth = Math.round(width * pixelRatio);
  const canvasHeight = Math.round(height * pixelRatio);

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  return {
    context,
    height,
    width
  };
}

function drawMineSceneCanvas(
  canvas: HTMLCanvasElement,
  images: MineSceneImages,
  activeZones: readonly MineSceneZone[],
  countdownLabel: string | null,
  selectedCellIndexes: readonly MineSceneCellIndex[],
  hoveredCellIndex: MineSceneCellIndex | null,
  frameTimeMs: number
) {
  const canvasState = resizeMineSceneCanvas(canvas);

  if (!canvasState) {
    return;
  }

  const { context, height, width } = canvasState;
  const sceneRect = { x: 0, y: 0, width, height };
  const boardRect = getMineSceneBoardRect(width, height);

  context.clearRect(0, 0, width, height);
  context.fillStyle = PAGE_BACKGROUND_COLOR;
  context.fillRect(0, 0, width, height);

  drawImageCover(context, images.background, sceneRect);
  drawMineSceneEdgeFade(context, width, height);

  images.cells.forEach((cellImage, index) => {
    const cellIndex = index as MineSceneCellIndex;
    const cellRect = getMineSceneCellRect(boardRect, MINE_SCENE_CELL_RECTS[index], CELL_DRAW_PADDING);

    context.save();

    if (hoveredCellIndex === cellIndex) {
      context.filter = "brightness(1.16)";
    }

    drawImageCover(context, cellImage, cellRect);
    context.restore();
  });

  activeZones.forEach((activeZone) => {
    drawMineSceneZone(context, boardRect, activeZone, frameTimeMs);
  });

  context.drawImage(images.mesh, boardRect.x, boardRect.y, boardRect.width, boardRect.height);

  selectedCellIndexes.forEach((cellIndex) => {
    const cellRect = getMineSceneCellRect(boardRect, MINE_SCENE_CELL_RECTS[cellIndex]);

    drawMineSceneSelection(context, cellRect);
  });

  if (countdownLabel) {
    drawMineSceneCountdownLabel(context, width, height, countdownLabel);
  }
}

function getMineSceneCellClickAtPoint(
  x: number,
  y: number,
  stageWidth: number,
  stageHeight: number
): MineSceneCellClick | null {
  const boardRect = getMineSceneBoardRect(stageWidth, stageHeight);

  for (let index = 0; index < MINE_SCENE_CELL_RECTS.length; index += 1) {
    const cellRect = getMineSceneCellRect(boardRect, MINE_SCENE_CELL_RECTS[index]);
    const isInsideCell =
      x >= cellRect.x &&
      x <= cellRect.x + cellRect.width &&
      y >= cellRect.y &&
      y <= cellRect.y + cellRect.height;

    if (isInsideCell) {
      return {
        cellHeight: cellRect.height,
        cellIndex: index as MineSceneCellIndex,
        cellWidth: cellRect.width,
        cellX: (x - cellRect.x) / cellRect.width,
        cellY: (y - cellRect.y) / cellRect.height,
        sceneX: x / stageWidth,
        sceneY: y / stageHeight
      };
    }
  }

  return null;
}

function isMineScenePointerAllowed(event: ReactPointerEvent<HTMLCanvasElement>) {
  return (
    event.nativeEvent.isTrusted &&
    event.isPrimary &&
    MINE_SCENE_ALLOWED_POINTER_TYPES.has(event.pointerType)
  );
}

function getMineScenePointerPoint(event: ReactPointerEvent<HTMLCanvasElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();

  return {
    height: bounds.height,
    width: bounds.width,
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top
  };
}

function getMineScenePointerDistance(
  pointer: MineScenePendingPointer,
  point: ReturnType<typeof getMineScenePointerPoint>
) {
  const deltaX = point.x - pointer.startX;
  const deltaY = point.y - pointer.startY;

  return Math.hypot(deltaX, deltaY);
}

function setMineScenePointerCapture(canvas: HTMLCanvasElement, pointerId: number) {
  try {
    canvas.setPointerCapture(pointerId);
  } catch {
    return;
  }
}

function releaseMineScenePointerCapture(canvas: HTMLCanvasElement, pointerId: number) {
  try {
    if (canvas.hasPointerCapture(pointerId)) {
      canvas.releasePointerCapture(pointerId);
    }
  } catch {
    return;
  }
}

export function MineScene({
  activeZones = EMPTY_MINE_SCENE_ZONES,
  className,
  countdownLabel = null,
  disabledCellIndexes = EMPTY_MINE_SCENE_CELL_INDEXES,
  onCellClick,
  selectedCellIndexes = EMPTY_MINE_SCENE_CELL_INDEXES
}: MineSceneProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendingPointerRef = useRef<MineScenePendingPointer | null>(null);
  const [hoveredCellIndex, setHoveredCellIndex] = useState<MineSceneCellIndex | null>(null);
  const [sceneImages, setSceneImages] = useState<MineSceneImages | null>(null);

  useEffect(() => {
    let isCancelled = false;

    void loadMineSceneImages()
      .then((loadedImages) => {
        if (isCancelled) {
          return;
        }

        setSceneImages(loadedImages);
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !sceneImages) {
      return;
    }

    const canvasElement = canvas;
    const loadedSceneImages = sceneImages;
    let animationFrameId = 0;

    function drawCanvasFrame(frameTimeMs: number) {
      drawMineSceneCanvas(
        canvasElement,
        loadedSceneImages,
        activeZones,
        countdownLabel,
        selectedCellIndexes,
        hoveredCellIndex,
        frameTimeMs
      );

      if (activeZones.length > 0) {
        animationFrameId = requestAnimationFrame(drawCanvasFrame);
      }
    }

    function redrawCanvas() {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(drawCanvasFrame);
    }

    const resizeObserver = new ResizeObserver(redrawCanvas);
    resizeObserver.observe(canvasElement);
    window.addEventListener("resize", redrawCanvas);
    redrawCanvas();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", redrawCanvas);
    };
  }, [activeZones, countdownLabel, hoveredCellIndex, sceneImages, selectedCellIndexes]);

  useEffect(() => {
    if (hoveredCellIndex === null) {
      return;
    }

    if (onCellClick && !disabledCellIndexes.includes(hoveredCellIndex)) {
      return;
    }

    setHoveredCellIndex(null);
  }, [disabledCellIndexes, hoveredCellIndex, onCellClick]);

  function getPointerCellClick(event: ReactPointerEvent<HTMLCanvasElement>) {
    const point = getMineScenePointerPoint(event);

    return getMineSceneCellClickAtPoint(point.x, point.y, point.width, point.height);
  }

  function getEnabledPointerCellClick(event: ReactPointerEvent<HTMLCanvasElement>) {
    const cellClick = getPointerCellClick(event);

    if (cellClick === null || disabledCellIndexes.includes(cellClick.cellIndex)) {
      return null;
    }

    return cellClick;
  }

  function handleCanvasPointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    pendingPointerRef.current = null;

    if (!onCellClick) {
      return;
    }

    event.preventDefault();

    if (!isMineScenePointerAllowed(event) || event.button !== 0) {
      return;
    }

    const cellClick = getEnabledPointerCellClick(event);

    if (cellClick === null) {
      return;
    }

    const point = getMineScenePointerPoint(event);

    pendingPointerRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startedAt: performance.now(),
      startX: point.x,
      startY: point.y
    };

    setMineScenePointerCapture(event.currentTarget, event.pointerId);
  }

  function handleCanvasPointerUp(event: ReactPointerEvent<HTMLCanvasElement>) {
    const pendingPointer = pendingPointerRef.current;

    pendingPointerRef.current = null;

    if (!onCellClick || !pendingPointer) {
      return;
    }

    event.preventDefault();

    if (
      !isMineScenePointerAllowed(event) ||
      event.pointerId !== pendingPointer.pointerId ||
      event.pointerType !== pendingPointer.pointerType
    ) {
      return;
    }

    releaseMineScenePointerCapture(event.currentTarget, event.pointerId);

    const point = getMineScenePointerPoint(event);
    const tapDurationMs = performance.now() - pendingPointer.startedAt;
    const tapDistance = getMineScenePointerDistance(pendingPointer, point);

    if (tapDurationMs > MINE_SCENE_MAX_TAP_DURATION_MS || tapDistance > MINE_SCENE_MAX_TAP_MOVE_PX) {
      return;
    }

    const cellClick = getEnabledPointerCellClick(event);

    if (cellClick === null) {
      return;
    }

    onCellClick(cellClick);
  }

  function handleCanvasPointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!onCellClick) {
      return;
    }

    if (!isMineScenePointerAllowed(event)) {
      setHoveredCellIndex(null);
      return;
    }

    const cellClick = getEnabledPointerCellClick(event);
    const cellIndex = cellClick?.cellIndex ?? null;

    setHoveredCellIndex((currentCellIndex) => {
      if (currentCellIndex === cellIndex) {
        return currentCellIndex;
      }

      return cellIndex;
    });
  }

  function handleCanvasPointerLeave() {
    setHoveredCellIndex(null);
  }

  function handleCanvasPointerCancel() {
    pendingPointerRef.current = null;
    setHoveredCellIndex(null);
  }

  function handleCanvasDoubleClick(event: ReactMouseEvent<HTMLCanvasElement>) {
    event.preventDefault();
  }

  return (
    <section className={clsx("mine-scene", className)} aria-label={t("mine.sceneLabel")}>
      <div className="mine-scene__stage">
        <canvas
          ref={canvasRef}
          className={clsx("mine-scene__canvas", {
            "mine-scene__canvas--interactive": Boolean(onCellClick),
            "mine-scene__canvas--targeted": hoveredCellIndex !== null
          })}
          role="img"
          aria-label={t("mine.sceneLabel")}
          onDoubleClick={handleCanvasDoubleClick}
          onLostPointerCapture={handleCanvasPointerCancel}
          onPointerCancel={handleCanvasPointerCancel}
          onPointerDown={handleCanvasPointerDown}
          onPointerUp={handleCanvasPointerUp}
          onPointerMove={handleCanvasPointerMove}
          onPointerLeave={handleCanvasPointerLeave}
        >
          {t("mine.sceneLabel")}
        </canvas>
      </div>
    </section>
  );
}
