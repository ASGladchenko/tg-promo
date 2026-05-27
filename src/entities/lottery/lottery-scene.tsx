"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import safeImage from "@/src/shared/images/safe.webp";
import safeDoorImage from "@/src/shared/images/safe_door.webp";

const LOOP_AUDIO_SRC = "/audio/moroccan_arab_afro_lounge_loop_5s.wav";

export default function LotteryScene() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    void audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });

    return () => {
      audio.pause();
    };
  }, []);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      await audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }

  return (
    <section className="lottery-scene" aria-label="Lottery scene">
      <audio ref={audioRef} src={LOOP_AUDIO_SRC} loop preload="auto" />
      <button className="lottery-scene__audio-toggle" type="button" onClick={() => void toggleAudio()}>
        {isPlaying ? "Звук: ВКЛ" : "Звук: ВЫКЛ"}
      </button>
      <div className="lottery-scene__stage">
        <Image className="lottery-scene__safe" src={safeImage} alt="Safe" priority />


        <Image className="lottery-scene__door" src={safeDoorImage} alt="Safe door" priority />
      </div>
    </section>
  );
}
