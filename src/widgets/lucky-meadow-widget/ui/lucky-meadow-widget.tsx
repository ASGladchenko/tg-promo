import { useCallback, useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { attemptsWalletQueryKey, useAttemptsWallet } from "@/entities/attempts";
import {
  LuckyMeadowScene,
  type LuckyMeadowAwardPrize,
  type LuckyMeadowGameResult,
  type LuckyMeadowSemiChoiceAction,
  type LuckyMeadowSemiChoiceResult,
  type LuckyMeadowPrize,
  luckyMeadowStateQueryKey,
  useLuckyMeadowAwardModalStore,
  useLuckyMeadowState,
  useLuckyMeadowStore,
  useOpenLuckyMeadowCell,
  useResolveLuckyMeadowSemiChoice,
  useStartLuckyMeadowSnapshot
} from "@/entities/lucky-meadow";
import {
  applyAwardedUserPrizeQueryData,
  myPrizesQueryKey
} from "@/entities/prizes";
import { SceneAudioToggle, type SceneAudioToggleHandle } from "@/features/toggle-scene-audio";
import { notify } from "@/shared/lib/toast";
import { GameUnavailablePlaceholder } from "@/shared/ui/game-unavailable-placeholder";

const LUCKY_MEADOW_AUDIO_SRC = "/audio/lucky-meadow-bg-voice.ogg";

function mapAwardedPrizeToLuckyMeadowAwardPrize(
  prize: { prizeData: Record<string, unknown>; promoCode: string | null },
  outcome: LuckyMeadowPrize
): LuckyMeadowAwardPrize {
  return {
    outcome,
    prizeData: { ...prize.prizeData },
    promoCode: prize.promoCode
  };
}

export const LuckyMeadowWidget = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const didWinJackpotInCurrentSessionRef = useRef(false);
  const sceneAudioRef = useRef<SceneAudioToggleHandle | null>(null);
  const userSnapshotIdRef = useRef<string | null>(null);
  const openAwardModal = useLuckyMeadowAwardModalStore((state) => state.open);

  const shouldResumeSceneAudioRef = useRef(false);
  const [jackpotAnimationKey, setJackpotAnimationKey] = useState(0);
  const [isSceneAudioPlaying, setIsSceneAudioPlaying] = useState(false);
  const setGameState = useLuckyMeadowStore((state) => state.setGameState);
  const setSemiChoicePending = useLuckyMeadowStore((state) => state.setSemiChoicePending);
  const luckyMeadowStateQuery = useLuckyMeadowState();
  const startSnapshotMutation = useStartLuckyMeadowSnapshot();
  const openCellMutation = useOpenLuckyMeadowCell();
  const resolveSemiChoiceMutation = useResolveLuckyMeadowSemiChoice();
  const { data: wallet } = useAttemptsWallet();
  const luckyMeadowState = luckyMeadowStateQuery.data;
  const isUnavailableWithoutJackpotWin =
    luckyMeadowState !== undefined &&
    luckyMeadowState.unavailableReason !== "jackpotWin" &&
    luckyMeadowState.mySnapshot?.status !== "active" &&
    (luckyMeadowState.unavailableReason !== undefined || luckyMeadowState.game === null);
  const canShowStartButton =
    Boolean(luckyMeadowState?.game) &&
    luckyMeadowState?.unavailableReason === undefined &&
    !luckyMeadowStateQuery.isFetching &&
    luckyMeadowState?.mySnapshot?.status !== "active";

  useEffect(() => {
    if (!luckyMeadowStateQuery.data) {
      return;
    }

    const snapshot = luckyMeadowStateQuery.data.mySnapshot;
    const currentGameState = useLuckyMeadowStore.getState();

    if (snapshot?.status === "active") {
      const isCurrentActiveSnapshot =
        userSnapshotIdRef.current === snapshot.id && currentGameState.isGameActive;

      userSnapshotIdRef.current = snapshot.id;

      if (isCurrentActiveSnapshot) {
        setSemiChoicePending(snapshot.semiChoiceRequired);
        return;
      }

      setGameState(true, snapshot.openedCells, snapshot.semiChoiceRequired);
      return;
    }

    if (userSnapshotIdRef.current && currentGameState.isGameActive) {
      return;
    }

    userSnapshotIdRef.current = null;
    setGameState(false, {});
  }, [luckyMeadowStateQuery.data, setGameState, setSemiChoicePending]);

  useEffect(() => {
    if (
      luckyMeadowStateQuery.data?.unavailableReason !== "jackpotWin" ||
      didWinJackpotInCurrentSessionRef.current
    ) {
      return;
    }

    setJackpotAnimationKey((currentKey) => currentKey + 1);
  }, [luckyMeadowStateQuery.data?.unavailableReason]);

  function pauseSceneAudioForGameOver() {
    if (shouldResumeSceneAudioRef.current) {
      return;
    }

    shouldResumeSceneAudioRef.current = sceneAudioRef.current?.pause() ?? false;
  }

  function resumeSceneAudioAfterGameOver() {
    if (!shouldResumeSceneAudioRef.current) {
      return;
    }

    shouldResumeSceneAudioRef.current = false;
    void sceneAudioRef.current?.play();
  }

  const handleStartGame = useCallback(async () => {
    if (!luckyMeadowStateQuery.data) {
      return false;
    }

    if (luckyMeadowStateQuery.data?.unavailableReason === "jackpotWin") {
      notify.warning(t("luckyMeadow.errors.jackpotWin"));
      return false;
    }

    if (luckyMeadowStateQuery.data?.unavailableReason === "dailyLimitReached") {
      notify.warning(t("luckyMeadow.errors.dailyLimitReached"));
      return false;
    }

    if (!canShowStartButton) {
      return false;
    }

    if (luckyMeadowStateQuery.data && !luckyMeadowStateQuery.data.game) {
      notify.warning(t("luckyMeadow.errors.unavailable"));
      return false;
    }

    if (wallet?.totalAttempts === 0) {
      notify.warning(t("luckyMeadow.errors.noAttempts"));
      return false;
    }

    try {
      const snapshot = await startSnapshotMutation.mutateAsync();
      userSnapshotIdRef.current = snapshot.id;
      void queryClient.invalidateQueries({ queryKey: attemptsWalletQueryKey });
      return true;
    } catch {
      notify.error(t("luckyMeadow.errors.start"));
      return false;
    }
  }, [
    canShowStartButton,
    luckyMeadowStateQuery.data,
    queryClient,
    startSnapshotMutation,
    t,
    wallet?.totalAttempts
  ]);

  const handleResultStatus = useCallback(
    (result: LuckyMeadowGameResult) => {
      if (result.prizeStatus === "semiFallbackAwarded") {
        void queryClient.invalidateQueries({ queryKey: attemptsWalletQueryKey });
      }

      if (result.prizeStatus === "jackpotUnavailable") {
        notify.info(t("luckyMeadow.results.jackpotUnavailable"));
      }

      if (result.prizeStatus === "semiDeclined") {
        notify.info(t("luckyMeadow.results.semiDeclined"));
      }

      if (result.prizeStatus === "semiUnavailable") {
        notify.info(t("luckyMeadow.results.semiUnavailable"));
      }
    },
    [queryClient, t]
  );

  const handleOpenCell = useCallback(
    async (position: number) => {
      const userSnapshotId = userSnapshotIdRef.current;

      if (!userSnapshotId) {
        notify.error(t("luckyMeadow.errors.missingSession"));
        void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });
        return null;
      }

      try {
        const result = await openCellMutation.mutateAsync({ position, userSnapshotId });

        if (result.status === "semiChoiceRequired") {
          setSemiChoicePending(true);
        }

        handleResultStatus(result);

        return result;
      } catch {
        notify.error(t("luckyMeadow.errors.openCell"));
        void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });
        return null;
      }
    },
    [handleResultStatus, openCellMutation, queryClient, setSemiChoicePending, t]
  );

  const handleResolveSemiChoice = useCallback(
    async (action: LuckyMeadowSemiChoiceAction): Promise<LuckyMeadowSemiChoiceResult | null> => {
      const userSnapshotId = userSnapshotIdRef.current;

      if (!userSnapshotId) {
        notify.error(t("luckyMeadow.errors.missingSession"));
        void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });
        return null;
      }

      try {
        const result = await resolveSemiChoiceMutation.mutateAsync({ action, userSnapshotId });

        setSemiChoicePending(false);
        void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });
        handleResultStatus(result);

        return result;
      } catch {
        notify.error(t("luckyMeadow.errors.resolveSemiChoice"));
        void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });
        return null;
      }
    },
    [handleResultStatus, queryClient, resolveSemiChoiceMutation, setSemiChoicePending, t]
  );

  const handleGameFinished = useCallback(
    (result: LuckyMeadowGameResult) => {
      userSnapshotIdRef.current = null;
      void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });

      if (result.prize) {
        if (result.prize === "jackpot") {
          didWinJackpotInCurrentSessionRef.current = true;
        }

        const awardedPrize = result.prizeInfo
          ? applyAwardedUserPrizeQueryData(queryClient, result.prizeInfo)
          : null;

        if (awardedPrize) {
          openAwardModal(mapAwardedPrizeToLuckyMeadowAwardPrize(awardedPrize, result.prize));
        } else {
          void queryClient.invalidateQueries({ queryKey: myPrizesQueryKey });
        }

        notify.success(t(`luckyMeadow.results.${result.prize}`));
      }
    },
    [openAwardModal, queryClient, t]
  );

  if (isUnavailableWithoutJackpotWin) {
    return (
      <GameUnavailablePlaceholder
        ariaLabel={t("luckyMeadow.widgetLabel")}
        message={t("luckyMeadow.availability.preparingNewGame")}
      />
    );
  }

  return (
    <LuckyMeadowScene
      canShowStartButton={canShowStartButton}
      isGameOverAudioEnabled={isSceneAudioPlaying}
      jackpotAnimationKey={jackpotAnimationKey}
      isSemiChoiceResolving={resolveSemiChoiceMutation.isPending}
      isStartPending={startSnapshotMutation.isPending}
      onGameFinished={handleGameFinished}
      onGameOverAudioStart={pauseSceneAudioForGameOver}
      onGameOverAudioEnd={resumeSceneAudioAfterGameOver}
      onOpenCell={handleOpenCell}
      onResolveSemiChoice={handleResolveSemiChoice}
      onStartGame={handleStartGame}
      audioToggle={
        <SceneAudioToggle
          ref={sceneAudioRef}
          src={LUCKY_MEADOW_AUDIO_SRC}
          onPlayingChange={setIsSceneAudioPlaying}
          playLabel={t("luckyMeadow.soundOn")}
          pauseLabel={t("luckyMeadow.soundOff")}
        />
      }
    />
  );
};
