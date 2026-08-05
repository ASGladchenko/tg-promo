import { type CSSProperties } from "react";

import "./lucky-meadow-prize-stripes.scss";

type LuckyMeadowPrizeRowStyle = CSSProperties & {
  "--row-delay": string;
};
type LuckyMeadowPrizeLetterStyle = CSSProperties & {
  "--letter-delay": string;
};

const PRIZE_STRIPE_ROW_COUNT = 6;
const PRIZE_STRIPE_TEXT = "LUCKY PRIZE";
const PRIZE_REEL_SPIN_COUNT = 7;
const PRIZE_ROW_DELAY_STEP = 0.08;
const PRIZE_REEL_ALPHABET = Array.from("LUCKYPRIZE");
const PRIZE_STRIPE_ROWS = Array.from({ length: PRIZE_STRIPE_ROW_COUNT }, (_, rowIndex) => rowIndex);
const PRIZE_STRIPE_LETTERS = Array.from(PRIZE_STRIPE_TEXT);

function getPrizeLetterReel(finalLetter: string, rowIndex: number, letterIndex: number) {
  const reelLetters = Array.from({ length: PRIZE_REEL_SPIN_COUNT }, (_, spinIndex) => {
    return PRIZE_REEL_ALPHABET[(rowIndex * 3 + letterIndex + spinIndex) % PRIZE_REEL_ALPHABET.length];
  });

  return [finalLetter, ...reelLetters];
}

export const LuckyMeadowPrizeStripes = () => {
  return (
    <div className="lucky-meadow-prize-stripes" aria-hidden="true">
      {PRIZE_STRIPE_ROWS.map((rowIndex) => {
        const rowDelay = rowIndex * PRIZE_ROW_DELAY_STEP;
        const rowStyle: LuckyMeadowPrizeRowStyle = { "--row-delay": `${rowDelay}s` };

        return (
          <span className="lucky-meadow-prize-stripes__row" key={rowIndex} style={rowStyle}>
            <span className="lucky-meadow-prize-stripes__word">
              {PRIZE_STRIPE_LETTERS.map((letter, letterIndex) => {
                if (letter === " ") {
                  return <span className="lucky-meadow-prize-stripes__gap" key={letterIndex} />;
                }

                const letterStyle: LuckyMeadowPrizeLetterStyle = { "--letter-delay": `${rowDelay}s` };

                return (
                  <span className="lucky-meadow-prize-stripes__letter" key={letterIndex} style={letterStyle}>
                    <span className="lucky-meadow-prize-stripes__letter-track">
                      {getPrizeLetterReel(letter, rowIndex, letterIndex).map(
                        (reelLetter, reelLetterIndex) => (
                          <span
                            className="lucky-meadow-prize-stripes__glyph"
                            key={`${reelLetter}-${reelLetterIndex}`}
                          >
                            {reelLetter}
                          </span>
                        )
                      )}
                    </span>
                  </span>
                );
              })}
            </span>
          </span>
        );
      })}
    </div>
  );
};
