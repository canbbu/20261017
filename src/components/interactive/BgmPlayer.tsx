"use client";

import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

const BGM_VOLUME = 0.55;

export function BgmPlayer({
  src,
  title,
  playLabel,
  pauseLabel,
}: {
  src: string;
  title: string;
  playLabel: string;
  pauseLabel: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const userPausedRef = useRef(false);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      await audio.play();
      playingRef.current = true;
      setPlaying(true);
      return true;
    } catch {
      playingRef.current = false;
      setPlaying(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;
    audio.volume = BGM_VOLUME;

    const onPlay = () => {
      if (cancelled) return;
      playingRef.current = true;
      setPlaying(true);
    };
    const onPause = () => {
      if (cancelled) return;
      playingRef.current = false;
      setPlaying(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    void tryPlay();

    const unlock = (event: Event) => {
      if (cancelled || userPausedRef.current) return;
      if (event.target instanceof Element && event.target.closest("[data-bgm-control]")) {
        return;
      }
      void tryPlay();
    };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
    };
  }, [tryPlay]);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingRef.current) {
      userPausedRef.current = true;
      audio.pause();
      playingRef.current = false;
      setPlaying(false);
      return;
    }

    userPausedRef.current = false;
    await tryPlay();
  }

  return (
    <>
      <audio
        ref={audioRef}
        className="sr-only"
        src={src}
        loop
        preload="auto"
        playsInline
        aria-hidden="true"
      />
      <button
        type="button"
        data-bgm-control=""
        className="control toast-shadow fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-4 z-[60] inline-grid size-11 place-items-center border border-line bg-surface text-accent"
        aria-label={playing ? pauseLabel : playLabel}
        aria-pressed={playing}
        aria-describedby="bgm-title"
        onClick={toggle}
      >
        {playing ? (
          <SpeakerHigh size={18} weight="regular" aria-hidden="true" />
        ) : (
          <SpeakerSlash size={18} weight="regular" aria-hidden="true" />
        )}
      </button>
      <span id="bgm-title" className="sr-only">
        {title}
      </span>
    </>
  );
}
