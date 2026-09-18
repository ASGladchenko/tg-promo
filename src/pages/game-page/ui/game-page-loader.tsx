import { useTranslation } from "react-i18next";

import { CircularProgressLoader } from "@/shared/ui/circular-progress-loader";

import "./game-page-loader.scss";

export function GamePageLoader() {
  const { t } = useTranslation();

  return (
    <div className="game-page-loader" role="status" aria-label={t("game.loading")} aria-live="polite">
      <CircularProgressLoader size={44} />
    </div>
  );
}
