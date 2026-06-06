import { useEffect, useRef } from "react";
import safeWheelImage from "@/shared/images/safe-wheel.webp";
import { useLotteryStore } from "../../model/lottery-store";
import "./safe-wheel.scss";

export function SafeWheel() {
  const wheelRef = useRef<HTMLImageElement | null>(null);
  const wheelRotation = useLotteryStore((state) => state.wheelRotation);

  useEffect(() => {
    wheelRef.current?.style.setProperty("--wheel-rotation", `${wheelRotation}deg`);
  }, [wheelRotation]);

  return (
    <img
      ref={wheelRef}
      className="lottery-scene__wheel"
      src={safeWheelImage}
      alt="Safe wheel"
      loading="eager"
      decoding="sync"
      draggable={false}
    />
  );
}
