"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BackgroundMusicTrack } from "@/lib/types";

const LS_TRACK = "portfolio-music-track-id";
const LS_MUTED = "portfolio-music-muted";

type Props = {
  tracks: BackgroundMusicTrack[];
  /** Fires when actual playback starts/stops (for starfield sync). */
  onPlayingChange?: (playing: boolean) => void;
};

/**
 * Floating audio controls (center-bottom). Browsers block autoplay with sound;
 * visitor taps Play to start. Track + mute preferences persist in localStorage.
 */
export default function BackgroundMusicDock({ tracks, onPlayingChange }: Props) {
  const [mounted, setMounted] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [activeId, setActiveId] = React.useState<number>(() => tracks[0]?.id ?? 0);
  const [muted, setMuted] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (tracks.length === 0) return;
    try {
      const raw = localStorage.getItem(LS_TRACK);
      const id = raw ? parseInt(raw, 10) : NaN;
      if (Number.isFinite(id) && tracks.some((t) => t.id === id)) {
        setActiveId(id);
      } else {
        setActiveId(tracks[0].id);
      }
      setMuted(localStorage.getItem(LS_MUTED) === "1");
    } catch {
      setActiveId(tracks[0].id);
    }
  }, [tracks]);

  const active = tracks.find((t) => t.id === activeId) ?? tracks[0];
  const src = active?.url ?? "";

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el || !src) return;
    el.pause();
    setPlaying(false);
    if (/^https?:\/\//i.test(src)) {
      el.crossOrigin = "anonymous";
    } else {
      el.removeAttribute("crossOrigin");
    }
    el.src = src;
    el.loop = true;
  }, [src]);

  React.useEffect(() => {
    const el = audioRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  React.useEffect(() => {
    onPlayingChange?.(playing);
  }, [playing, onPlayingChange]);

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !src) return;
    if (!el.paused) {
      el.pause();
      return;
    }
    void el.play().catch(() => setPlaying(false));
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(LS_MUTED, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const onTrackChange = (v: string) => {
    const id = parseInt(v, 10);
    if (!Number.isFinite(id)) return;
    setActiveId(id);
    try {
      localStorage.setItem(LS_TRACK, String(id));
    } catch {
      /* ignore */
    }
  };

  if (!mounted || tracks.length === 0) return null;

  const ui = (
    <div
      className={cn(
        "pointer-events-auto fixed bottom-6 left-1/2 z-[115] flex -translate-x-1/2 items-center gap-1.5 rounded-2xl border border-primary/25 bg-gradient-to-br from-card/95 via-background/90 to-card/95 px-2 py-2 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.35),0_0_0_1px_hsl(var(--accent)/0.12)] backdrop-blur-xl sm:gap-2 sm:px-3",
        "max-w-[min(100vw-1rem,28rem)]",
        playing && "ring-1 ring-accent/40"
      )}
      role="region"
      aria-label="Background music"
    >
      <audio
        key={src}
        ref={audioRef}
        preload="metadata"
        loop
        playsInline
        className="hidden"
      />
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary",
          playing && "animate-pulse shadow-[0_0_16px_hsl(var(--accent)/0.45)]"
        )}
        aria-hidden
      >
        <Music className="h-4 w-4" />
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-9 w-9 shrink-0 rounded-xl hover:bg-primary/10"
        onClick={togglePlay}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-9 w-9 shrink-0 rounded-xl hover:bg-primary/10"
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      {tracks.length > 1 ? (
        <Select value={String(activeId)} onValueChange={onTrackChange}>
          <SelectTrigger className="h-9 min-w-0 flex-1 rounded-xl border-border/60 bg-muted/30 text-xs sm:text-sm">
            <SelectValue placeholder="Track" />
          </SelectTrigger>
          <SelectContent className="z-[130]">
            {tracks.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="truncate px-1 text-xs font-medium text-foreground/90 sm:text-sm">{active?.label}</span>
      )}
    </div>
  );

  return createPortal(ui, document.body);
}
