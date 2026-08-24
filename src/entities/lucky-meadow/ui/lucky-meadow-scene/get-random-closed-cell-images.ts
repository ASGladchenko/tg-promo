import { luckyMeadowClosedCellImages } from "./lucky-meadow-scene-assets";

const getRandomClosedCellImage = () => {
  return (
    luckyMeadowClosedCellImages[Math.floor(Math.random() * luckyMeadowClosedCellImages.length)] ??
    luckyMeadowClosedCellImages[0]
  );
};

export const getRandomClosedCellImages = (count: number) => {
  return Array.from({ length: count }, getRandomClosedCellImage);
};
