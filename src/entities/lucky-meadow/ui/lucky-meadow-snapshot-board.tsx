import clsx from "clsx";

import { type LuckyMeadowUserSessionCell } from "../model/types";
import { luckyMeadowOpenedCellImages } from "./lucky-meadow-scene/lucky-meadow-scene-assets";

import "./lucky-meadow-snapshot-board.scss";

type LuckyMeadowSnapshotBoardProps = {
  cells: readonly LuckyMeadowUserSessionCell[];
};

const outcomeLabels: Record<LuckyMeadowUserSessionCell["outcome"], string> = {
  empty: "Empty",
  jackpot: "Jackpot",
  semi_jackpot: "Lucky Prize",
  trap: "Trap"
};

const outcomeImages: Record<LuckyMeadowUserSessionCell["outcome"], string> = {
  empty: luckyMeadowOpenedCellImages.empty,
  jackpot: luckyMeadowOpenedCellImages.jackpot,
  semi_jackpot: luckyMeadowOpenedCellImages.lucky,
  trap: luckyMeadowOpenedCellImages.skull
};

export function LuckyMeadowSnapshotBoard({ cells }: LuckyMeadowSnapshotBoardProps) {
  const sortedCells = [...cells].sort((left, right) => left.position - right.position);

  return (
    <div aria-label="Lucky Meadow field" className="snapshot-board" role="list">
      {sortedCells.map((cell) => {
        const isOpened = cell.openedAt !== null;
        const outcomeLabel = outcomeLabels[cell.outcome];

        return (
          <div
            aria-label={`Cell ${cell.position + 1}: ${outcomeLabel}, ${isOpened ? "opened" : "not opened"}`}
            className={clsx("snapshot-board__cell", {
              "snapshot-board__cell--closed": !isOpened,
              "snapshot-board__cell--opened": isOpened
            })}
            key={cell.position}
            role="listitem"
          >
            <img alt="" src={outcomeImages[cell.outcome]} />
            <span className="snapshot-board__position" aria-hidden="true">
              {cell.position + 1}
            </span>
            <span className="snapshot-board__state" aria-hidden="true">
              {isOpened ? "Opened" : "Hidden"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
