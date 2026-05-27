"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import safeImage from "@/src/shared/images/safe.webp";
import safeDoorImage from "@/src/shared/images/safe_door.webp";
import MuteIcon from "@/src/shared/svg/mute.svg";
import VolumeIcon from "@/src/shared/svg/volume.svg";

const LOOP_AUDIO_SRC = "/audio/16s.ogg";
const AUDIO_START_EVENTS = ["pointerdown", "click", "touchstart", "keydown"] as const;

export default function LotteryScene() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

    return () => {
      removeStartListeners();
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
    setIsPlaying(false);
  }

  return (
    <section className="lottery-scene" aria-label="Lottery scene">
      <audio ref={audioRef} src={LOOP_AUDIO_SRC} loop preload="none" />
      <div className="lottery-scene__stage">
        <Image className="lottery-scene__safe" src={safeImage} alt="Safe" priority />

        <div className='lottery-scene__door-wrapper'>
          <Image className="lottery-scene__door" src={safeDoorImage} alt="Safe door" priority />
        </div>
        
      
      </div>

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
