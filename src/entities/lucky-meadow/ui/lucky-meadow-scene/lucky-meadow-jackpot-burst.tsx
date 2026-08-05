import { type CSSProperties, useMemo } from "react";

import "./lucky-meadow-jackpot-burst.scss";

type LuckyMeadowJackpotFlyerStyle = CSSProperties & {
  "--jackpot-color": string;
  "--jackpot-delay": string;
  "--jackpot-from-y": string;
  "--jackpot-glow": string;
};
type LuckyMeadowJackpotCenterStyle = CSSProperties & {
  "--jackpot-center-delay": string;
};

type LuckyMeadowJackpotFlyer = {
  color: string;
  delay: string;
  glow: string;
  rowIndex: number;
};

const JACKPOT_TEXT = "JACKPOT";
const JACKPOT_ROW_COUNT = 6;
const JACKPOT_FLYER_DELAY_STEP = 0.16;
const JACKPOT_CENTER_DELAY = `${JACKPOT_FLYER_DELAY_STEP * JACKPOT_ROW_COUNT + 0.58}s`;
const JACKPOT_COLORS = [
  { color: "#ffbe35", glow: "rgb(255 190 53 / 86%)" },
  { color: "#ffffff", glow: "rgb(255 255 255 / 82%)" },
  { color: "#d8b7ff", glow: "rgb(155 61 255 / 84%)" }
];

function shuffleRows(rows: number[]) {
  const nextRows = [...rows];

  for (let index = nextRows.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextRows[index], nextRows[swapIndex]] = [nextRows[swapIndex], nextRows[index]];
  }

  return nextRows;
}

function createJackpotFlyers(): LuckyMeadowJackpotFlyer[] {
  const rowOrder = [0, ...shuffleRows([1, 2, 3, 4, 5])];
  const colorOffset = Math.floor(Math.random() * JACKPOT_COLORS.length);

  return rowOrder.map((rowIndex, orderIndex) => {
    const color = JACKPOT_COLORS[(colorOffset + orderIndex) % JACKPOT_COLORS.length];

    return {
      ...color,
      delay: `${orderIndex * JACKPOT_FLYER_DELAY_STEP}s`,
      rowIndex
    };
  });
}

export const LuckyMeadowJackpotBurst = () => {
  const flyers = useMemo(createJackpotFlyers, []);
  const centerStyle: LuckyMeadowJackpotCenterStyle = { "--jackpot-center-delay": JACKPOT_CENTER_DELAY };

  return (
    <div className="lucky-meadow-jackpot-burst" aria-hidden="true">
      {flyers.map((flyer) => {
        const flyerStyle: LuckyMeadowJackpotFlyerStyle = {
          "--jackpot-color": flyer.color,
          "--jackpot-delay": flyer.delay,
          "--jackpot-from-y": `${((flyer.rowIndex + 0.5) / JACKPOT_ROW_COUNT) * 100}%`,
          "--jackpot-glow": flyer.glow
        };

        return (
          <span className="lucky-meadow-jackpot-burst__flyer" key={flyer.rowIndex} style={flyerStyle}>
            {JACKPOT_TEXT}
          </span>
        );
      })}
      <span className="lucky-meadow-jackpot-burst__center" style={centerStyle}>
        {JACKPOT_TEXT}
      </span>
    </div>
  );
};
