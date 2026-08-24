import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

import clsx from "clsx";

import MuteIcon from "@/shared/svg/mute.svg?react";
import VolumeIcon from "@/shared/svg/volume.svg?react";

import "./scene-audio-toggle.scss";

type SceneAudioToggleProps = {
  className?: string;
  onPlayingChange?: (isPlaying: boolean) => void;
  pauseLabel: string;
  playLabel: string;
  src: string;
  volume?: number;
};

export type SceneAudioToggleHandle = {
  pause: () => boolean;
  play: () => Promise<boolean>;
};

const AUDIO_START_EVENTS = ["pointerdown", "click", "touchstart", "keydown"] as const;

export const SceneAudioToggle = forwardRef<SceneAudioToggleHandle, SceneAudioToggleProps>(
  function SceneAudioToggle({ className, onPlayingChange, pauseLabel, playLabel, src, volume = 0.01 }, ref) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const shouldResumeAudioRef = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const playAudio = useCallback(async () => {
      const audio = audioRef.current;
      if (!audio) {
        return false;
      }

      try {
        await audio.play();
        setIsPlaying(true);
        return true;
      } catch {
        setIsPlaying(false);
        return false;
      }
    }, []);

    const pauseAudio = useCallback((shouldResume: boolean) => {
      const audio = audioRef.current;
      if (!audio || audio.paused) {
        return false;
      }

      shouldResumeAudioRef.current = shouldResume;
      audio.pause();
      setIsPlaying(false);

      return true;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        pause: () => pauseAudio(false),
        play: playAudio
      }),
      [pauseAudio, playAudio]
    );

    useEffect(() => {
      onPlayingChange?.(isPlaying);
    }, [isPlaying, onPlayingChange]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      const audioElement = audio;
      audioElement.volume = volume;

      function removeStartListeners() {
        AUDIO_START_EVENTS.forEach((eventName) => {
          document.removeEventListener(eventName, startAudioAfterInteraction);
        });
      }

      function startAudioAfterInteraction(event: Event) {
        const target = event.target;

        if (target instanceof Element && target.closest(".scene-audio-toggle")) {
          return;
        }

        void playAudio().then((started) => {
          if (started) {
            removeStartListeners();
          }
        });
      }

      AUDIO_START_EVENTS.forEach((eventName) => {
        document.addEventListener(eventName, startAudioAfterInteraction);
      });

      function pauseAudioForBackground() {
        pauseAudio(true);
      }

      function resumeAudioAfterBackground() {
        if (!shouldResumeAudioRef.current || document.visibilityState === "hidden") {
          return;
        }

        void playAudio().then((started) => {
          if (started) {
            shouldResumeAudioRef.current = false;
          }
        });
      }

      function handleVisibilityChange() {
        if (document.visibilityState === "hidden") {
          pauseAudioForBackground();
          return;
        }

        resumeAudioAfterBackground();
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("pagehide", pauseAudioForBackground);
      window.addEventListener("blur", pauseAudioForBackground);
      window.addEventListener("pageshow", resumeAudioAfterBackground);
      window.addEventListener("focus", resumeAudioAfterBackground);

      return () => {
        removeStartListeners();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("pagehide", pauseAudioForBackground);
        window.removeEventListener("blur", pauseAudioForBackground);
        window.removeEventListener("pageshow", resumeAudioAfterBackground);
        window.removeEventListener("focus", resumeAudioAfterBackground);
        audioElement.pause();
      };
    }, [pauseAudio, playAudio, volume]);

    async function toggleAudio() {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      if (audio.paused) {
        const started = await playAudio();
        if (started) {
          shouldResumeAudioRef.current = false;
        }
        return;
      }

      pauseAudio(false);
    }

    return (
      <>
        <audio ref={audioRef} src={src} loop preload="none" />

        <button
          className={clsx("scene-audio-toggle", className)}
          type="button"
          onClick={() => void toggleAudio()}
          aria-label={isPlaying ? pauseLabel : playLabel}
          title={isPlaying ? pauseLabel : playLabel}
        >
          {isPlaying ? (
            <VolumeIcon className="scene-audio-toggle__icon" aria-hidden="true" focusable="false" />
          ) : (
            <MuteIcon className="scene-audio-toggle__icon" aria-hidden="true" focusable="false" />
          )}
        </button>
      </>
    );
  }
);
