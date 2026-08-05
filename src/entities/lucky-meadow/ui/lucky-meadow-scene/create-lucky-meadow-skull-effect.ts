export type LuckyMeadowSkullEffectState = {
  id: number;
  size: number;
  x: number;
  y: number;
};

export function createLuckyMeadowSkullEffect(cellRect: DOMRect): LuckyMeadowSkullEffectState {
  return {
    id: Date.now(),
    size: cellRect.width,
    x: cellRect.left + cellRect.width / 2,
    y: cellRect.top + cellRect.height / 2
  };
}
