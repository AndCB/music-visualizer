import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  current: number;
  duration: number;
  onSeek: (time: number) => void;
  showLabels?: boolean;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ProgressBar({ current, duration, onSeek, showLabels = true }: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragProgress, setDragProgress] = useState<number | null>(null);

  const seekToEvent = (clientX: number): number | null => {
    const el = trackRef.current;
    if (!el || duration <= 0) return null;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    return ratio * duration;
  };

  const onSeekRef = useRef(onSeek);
  onSeekRef.current = onSeek;
  const seekToEventRef = useRef(seekToEvent);
  seekToEventRef.current = seekToEvent;
  const durationRef = useRef(duration);
  durationRef.current = duration;

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const isDragging = dragProgress !== null;
  const displayProgress = isDragging ? dragProgress : progress;

  const handleMouseDown = (e: React.MouseEvent) => {
    const time = seekToEvent(e.clientX);
    if (time !== null) {
      onSeekRef.current(time);
      setDragProgress((time / duration) * 100);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const time = seekToEventRef.current(e.clientX);
      if (time !== null) {
        setDragProgress((time / durationRef.current) * 100);
      }
    };

    const handleUp = (e: MouseEvent) => {
      const time = seekToEventRef.current(e.clientX);
      if (time !== null) {
        onSeekRef.current(time);
      }
      setDragProgress(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const time = seekToEventRef.current(touch.clientX);
      if (time !== null) {
        setDragProgress((time / durationRef.current) * 100);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const time = seekToEventRef.current(touch.clientX);
      if (time !== null) {
        onSeekRef.current(time);
      }
      setDragProgress(null);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between text-white/60 text-xs mb-1.5 tabular-nums">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
      {/* Outer wrapper with padded clickable area */}
      <div
        ref={trackRef}
        className="relative py-2 group cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          const time = seekToEvent(touch.clientX);
          if (time !== null) {
            onSeekRef.current(time);
            setDragProgress((time / duration) * 100);
          }
        }}
      >
        {/* Visual track */}
        <div className="relative h-[3px] rounded-full bg-white/20">
          {/* Filled portion */}
          <div
            className="absolute h-full rounded-full bg-white"
            style={{ width: `${displayProgress}%` }}
          />
          {/* Thumb indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${displayProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
