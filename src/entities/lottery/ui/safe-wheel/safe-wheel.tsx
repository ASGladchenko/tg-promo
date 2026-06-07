import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import safeWheelImage from "@/shared/images/safe-wheel.webp";
import { useLotteryStore } from "../../model/lottery-store";
import "./safe-wheel.scss";

export function SafeWheel() {
  const { t } = useTranslation();
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
      alt={t("lottery.safeWheelAlt")}
      loading="eager"
      decoding="sync"
      draggable={false}
    />
  );
}
