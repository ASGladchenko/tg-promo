import { useEffect, useRef } from "react";
import safeWheelImage from "@/shared/images/safe-wheel.webp";
import { subscribeWheelSpin } from "../model/wheel-spin-bridge";

export default function SafeWheel() {
  const wheelRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeWheelSpin((rotationDegrees) => {
      wheelRef.current?.style.setProperty("--wheel-rotation", `${rotationDegrees}deg`);
    });

    return unsubscribe;
  }, []);

  return (
    <img
      ref={wheelRef}
      className="lottery-scene__wheel"
      src={safeWheelImage}
      alt="Safe wheel"
      loading="eager"
      decoding="sync"
    />
  );
}
