import { useCallback } from "react";

import { LotteryCodePanel, LotteryScene } from "@/entities/lottery";
import { useLotteryCodeCheckFlow } from "@/features/check-lottery-combination";

import "./lottery-widget-scene.scss";

type LotteryWidgetSceneProps = {
  onAssetsReady?: () => void;
};

export function LotteryWidgetScene({ onAssetsReady }: LotteryWidgetSceneProps) {
  const { checkCombination, checkError, clearCheckError, isChecking } = useLotteryCodeCheckFlow();

  const handleCheck = useCallback(
    (digits: string[]) => {
      void checkCombination([...digits]);
    },
    [checkCombination]
  );

  const handleCodeChange = useCallback(() => {
    clearCheckError();
  }, [clearCheckError]);

  const codePanel = (
    <>
      <LotteryCodePanel
        hideSelectedDigitsFromOtherColumns
        isChecking={isChecking}
        onCheck={handleCheck}
        onCodeChange={handleCodeChange}
      />

      {checkError ? (
        <p className="lottery-widget-scene__check-error" role="status">
          {checkError}
        </p>
      ) : null}
    </>
  );

  return <LotteryScene codePanel={codePanel} onAssetsReady={onAssetsReady} />;
}
