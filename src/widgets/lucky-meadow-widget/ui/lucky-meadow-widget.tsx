import { useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { LuckyMeadowScene } from "@/entities/lucky-meadow";
import { SceneAudioToggle, type SceneAudioToggleHandle } from "@/features/toggle-scene-audio";

const LUCKY_MEADOW_AUDIO_SRC = "/audio/lucky-meadow-bg-voice.ogg";

export const LuckyMeadowWidget = () => {
  const { t } = useTranslation();
  const sceneAudioRef = useRef<SceneAudioToggleHandle | null>(null);
  const jackpotBurstTriggerRef = useRef<(() => void) | null>(null);
  const prizeStripesTriggerRef = useRef<(() => void) | null>(null);

  const shouldResumeSceneAudioRef = useRef(false);
  const [isSceneAudioPlaying, setIsSceneAudioPlaying] = useState(false);

  function pauseSceneAudioForGameOver() {
    if (shouldResumeSceneAudioRef.current) {
      return;
    }

    shouldResumeSceneAudioRef.current = sceneAudioRef.current?.pause() ?? false;
  }

  function handleLuckyTrigger() {
    prizeStripesTriggerRef.current?.();
  }

  function handleJackpotTrigger() {
    jackpotBurstTriggerRef.current?.();
  }
  function resumeSceneAudioAfterGameOver() {
    if (!shouldResumeSceneAudioRef.current) {
      return;
    }

    shouldResumeSceneAudioRef.current = false;
    void sceneAudioRef.current?.play();
  }

  return (
    <>
      <button onClick={handleLuckyTrigger}>Lucky Prize</button>
      <button onClick={handleJackpotTrigger}>Jackpot</button>
      <LuckyMeadowScene
        isGameOverAudioEnabled={isSceneAudioPlaying}
        onGameOverAudioStart={pauseSceneAudioForGameOver}
        onGameOverAudioEnd={resumeSceneAudioAfterGameOver}
        onJackpotBurstTriggerReady={(triggerJackpotBurst) => {
          jackpotBurstTriggerRef.current = triggerJackpotBurst;
        }}
        onPrizeStripesTriggerReady={(triggerPrizeStripes) => {
          prizeStripesTriggerRef.current = triggerPrizeStripes;
        }}
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
