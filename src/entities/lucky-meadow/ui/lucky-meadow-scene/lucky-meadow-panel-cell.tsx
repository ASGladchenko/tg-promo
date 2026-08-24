import clsx from "clsx";

import type { LuckyMeadowCellOutcome } from "../../model/types";
import { luckyMeadowOpenedCellImages } from "./lucky-meadow-scene-assets";
import "./lucky-meadow-panel-cell.scss";

type LuckyMeadowPanelCellProps = {
  cellIndex: number;
  closedImage: string;
  isLocked: boolean;
  isOpening: boolean;
  openedOutcome: LuckyMeadowCellOutcome | undefined;
  onOpen: (cellIndex: number, cellElement: HTMLButtonElement) => void;
};

function getLuckyMeadowPanelCellLabel(cellIndex: number, openedOutcome: LuckyMeadowCellOutcome | undefined) {
  if (openedOutcome) {
    return `Cell ${cellIndex + 1}: ${openedOutcome}`;
  }

  return `Open cell ${cellIndex + 1}`;
}

export const LuckyMeadowPanelCell = ({
  cellIndex,
  closedImage,
  isLocked,
  isOpening,
  openedOutcome,
  onOpen
}: LuckyMeadowPanelCellProps) => {
  const openedImage = openedOutcome ? luckyMeadowOpenedCellImages[openedOutcome] : null;
  const isOpened = Boolean(openedImage);

  return (
    <button
      className={clsx("lucky-meadow-panel-cell", {
        "lucky-meadow-panel-cell--opened": isOpened,
        "lucky-meadow-panel-cell--opening": isOpening,
        "lucky-meadow-panel-cell--skull": openedOutcome === "skull"
      })}
      type="button"
      aria-label={getLuckyMeadowPanelCellLabel(cellIndex, openedOutcome)}
      disabled={isLocked || isOpened}
      onClick={(event) => {
        void onOpen(cellIndex, event.currentTarget);
      }}
    >
      <span className="lucky-meadow-panel-cell__flipper">
        <span className="lucky-meadow-panel-cell__face">
          <img src={closedImage} alt="" />
        </span>
        <span className="lucky-meadow-panel-cell__face lucky-meadow-panel-cell__face--back">
          {openedImage && <img src={openedImage} alt="" />}
        </span>
      </span>
    </button>
  );
};
