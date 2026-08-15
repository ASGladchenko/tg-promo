import { useCallback, useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { attemptsWalletQueryKey, useAttemptsWallet } from "@/entities/attempts";
import {
  LuckyMeadowScene,
  type LuckyMeadowOpenCellResult,
  luckyMeadowStateQueryKey,
  useLuckyMeadowState,
  useLuckyMeadowStore,
  useOpenLuckyMeadowCell,
  useStartLuckyMeadowSnapshot
} from "@/entities/lucky-meadow";
import { myPrizesQueryKey } from "@/entities/prizes";
import { SceneAudioToggle, type SceneAudioToggleHandle } from "@/features/toggle-scene-audio";
import { notify } from "@/shared/lib/toast";

const LUCKY_MEADOW_AUDIO_SRC = "/audio/lucky-meadow-bg-voice.ogg";

export const LuckyMeadowWidget = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const sceneAudioRef = useRef<SceneAudioToggleHandle | null>(null);
  const userSnapshotIdRef = useRef<string | null>(null);

  const shouldResumeSceneAudioRef = useRef(false);
  const [isSceneAudioPlaying, setIsSceneAudioPlaying] = useState(false);
  const setGameState = useLuckyMeadowStore((state) => state.setGameState);
  const luckyMeadowStateQuery = useLuckyMeadowState();
  const startSnapshotMutation = useStartLuckyMeadowSnapshot();
  const openCellMutation = useOpenLuckyMeadowCell();
  const { data: wallet } = useAttemptsWallet();
  const canShowStartButton =
    Boolean(luckyMeadowStateQuery.data) &&
    !luckyMeadowStateQuery.isFetching &&
    luckyMeadowStateQuery.data?.mySnapshot?.status !== "active";

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
        return;
      }

      setGameState(true, snapshot.openedCells);
      return;
    }

    if (userSnapshotIdRef.current && currentGameState.isGameActive) {
      return;
    }

    userSnapshotIdRef.current = null;
    setGameState(false, {});
  }, [luckyMeadowStateQuery.data, setGameState]);

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
    if (!canShowStartButton || !luckyMeadowStateQuery.data) {
      return false;
    }

    if (luckyMeadowStateQuery.data?.unavailableReason === "dailyLimitReached") {
      notify.warning(t("luckyMeadow.errors.dailyLimitReached"));
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

        if (result.prizeStatus === "jackpotUnavailable") {
          notify.info(t("luckyMeadow.results.jackpotUnavailable"));
        }

        return result;
      } catch {
        notify.error(t("luckyMeadow.errors.openCell"));
        void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });
        return null;
      }
    },
    [openCellMutation, queryClient, t]
  );

  const handleGameFinished = useCallback(
    (result: LuckyMeadowOpenCellResult) => {
      userSnapshotIdRef.current = null;
      void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });

      if (result.prize) {
        void queryClient.invalidateQueries({ queryKey: myPrizesQueryKey });
        notify.success(t(`luckyMeadow.results.${result.prize}`));
      }
    },
    [queryClient, t]
  );

  return (
    <>
      <LuckyMeadowScene
        canShowStartButton={canShowStartButton}
        isGameOverAudioEnabled={isSceneAudioPlaying}
        isStartPending={startSnapshotMutation.isPending}
        onGameFinished={handleGameFinished}
        onGameOverAudioStart={pauseSceneAudioForGameOver}
        onGameOverAudioEnd={resumeSceneAudioAfterGameOver}
        onOpenCell={handleOpenCell}
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
    </>
  );
};
