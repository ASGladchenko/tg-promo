"use client";

import { useEffect, useRef, useState } from "react";
import safeImage from "@/shared/images/safe.webp";
import safeDoorImage from "@/shared/images/safe_door.webp";
import MuteIcon from "@/shared/svg/mute.svg?react";
import VolumeIcon from "@/shared/svg/volume.svg?react";
import LotteryCodePanel from "../lottery-code-panel/lottery-code-panel";

const LOOP_AUDIO_SRC = "/audio/16s.ogg";
const AUDIO_START_EVENTS = ["pointerdown", "click", "touchstart", "keydown"] as const;

export default function LotteryScene() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldResumeAudioRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playAudio(audio: HTMLAudioElement) {
    try {
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const audioElement = audio;
    audioElement.volume = 0.05;

    function removeStartListeners() {
      AUDIO_START_EVENTS.forEach((eventName) => {
        document.removeEventListener(eventName, startAudioAfterInteraction);
      });
    }

    function startAudioAfterInteraction(event: Event) {
      const target = event.target;

      if (target instanceof Element && target.closest(".lottery-scene__audio-toggle")) {
        return;
      }

      void playAudio(audioElement).then((started) => {
        if (started) {
          removeStartListeners();
        }
      });
    }

    AUDIO_START_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, startAudioAfterInteraction);
    });

    function pauseAudioForBackground() {
      if (audioElement.paused) {
        return;
      }

      shouldResumeAudioRef.current = true;
      audioElement.pause();
      setIsPlaying(false);
    }

    function resumeAudioAfterBackground() {
      if (!shouldResumeAudioRef.current || document.visibilityState === "hidden") {
        return;
      }

      void playAudio(audioElement).then((started) => {
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
  }, []);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      await playAudio(audio);
      return;
    }

    audio.pause();
    shouldResumeAudioRef.current = false;
    setIsPlaying(false);
  }

  return (
    <section className="lottery-scene" aria-label="Lottery scene">
      <audio ref={audioRef} src={LOOP_AUDIO_SRC} loop preload="none" />
      <div className="lottery-scene__stage">
        <img className="lottery-scene__safe" src={safeImage} alt="Safe" loading="eager" />

        <div className="lottery-scene__door-wrapper">
          <img className="lottery-scene__door" src={safeDoorImage} alt="Safe door" loading="eager" />
        </div>
      </div>

      <LotteryCodePanel />

      <button
        className="lottery-scene__audio-toggle"
        type="button"
        onClick={() => void toggleAudio()}
        aria-label={isPlaying ? "Выключить звук" : "Включить звук"}
        title={isPlaying ? "Выключить звук" : "Включить звук"}
      >
        {isPlaying ? (
          <VolumeIcon className="lottery-scene__audio-icon" aria-hidden="true" focusable="false" />
        ) : (
          <MuteIcon className="lottery-scene__audio-icon" aria-hidden="true" focusable="false" />
        )}
      </button>
    </section>
  );
}
