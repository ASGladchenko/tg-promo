import type { CSSProperties } from "react";

import type { LuckyMeadowSkullEffectState } from "./create-lucky-meadow-skull-effect";
import { luckyMeadowOpenedCellImages } from "./lucky-meadow-scene-assets";
import "./lucky-meadow-skull-effect.scss";

type LuckyMeadowSkullEffectStyle = CSSProperties & {
  "--skull-start-size": string;
  "--skull-start-x": string;
  "--skull-start-y": string;
};

type LuckyMeadowSkullEffectProps = {
  effect: LuckyMeadowSkullEffectState;
  onAnimationEnd: () => void;
};

function getLuckyMeadowSkullEffectStyle(effect: LuckyMeadowSkullEffectState): LuckyMeadowSkullEffectStyle {
  return {
    "--skull-start-size": `${effect.size}px`,
    "--skull-start-x": `${effect.x}px`,
    "--skull-start-y": `${effect.y}px`
  };
}

export const LuckyMeadowSkullEffect = ({ effect, onAnimationEnd }: LuckyMeadowSkullEffectProps) => {
  return (
    <img
      className="lucky-meadow-skull-effect"
      src={luckyMeadowOpenedCellImages.skull}
      alt=""
      aria-hidden="true"
      style={getLuckyMeadowSkullEffectStyle(effect)}
      onAnimationEnd={onAnimationEnd}
    />
  );
};
