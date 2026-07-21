import { Track, usePlaylist } from "@/contexts/PlaylistContext";
import React, { createRef, useEffect } from "react";
import { X, Music } from "lucide-react";
import styles from "../styles/TrackEntry.module.css";
import Image from "next/image";

interface TrackEntryProps {
  index: number;
  track: Track;
}

export const TrackEntry: React.FC<TrackEntryProps> = ({
  index,
  track,
}) => {
  const { playTrack, currentTrackId, removeTrack } = usePlaylist();
  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const textNode = container.firstChild as HTMLSpanElement;

    if (!textNode) return;

    // Reset font size to ensure accurate calculations
    textNode.style.fontSize = "inherit";

    // While text overflows the container
    if (
      container.offsetWidth < container.scrollWidth ||
      container.offsetHeight < container.scrollHeight
    ) {
      textNode.classList.add(`${styles.movingText}`);
    }
  }, [containerRef]);

  const handleRemoveTrack = () => {
    removeTrack(index);
  };

  return (
    <div
      className={`flex items-center gap-1.5 rounded-xl p-1.5 ${
        index == currentTrackId
          ? "bg-white/15 backdrop-blur-sm border border-white/20 border-l-2 border-l-purple-400/70 shadow-[0_0_12px_rgba(255,255,255,0.1)]"
          : "border border-white/10"
      }`}
      style={{ direction: "ltr" }}
    >
      <button
        className="flex items-center text-center justify-between flex-1 gap-1.5"
        onClick={() => playTrack(index)}
      >
        {track.cover ? (
          <Image
            src={track.cover}
            alt="track cover"
            height={32}
            width={32}
            className="rounded-md shrink-0"
            fetchPriority="low"
          />
        ) : (
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
            <Music className="w-4 h-4 text-white/50" />
          </div>
        )}
        <div ref={containerRef} className="flex flex-col overflow-hidden flex-1">
          <span
            className={`text-white/90 max-w-28 font-bold whitespace-nowrap`}
          >
            <b>{track.name}</b>
          </span>
          <b className="text-white/60 text-xs text-nowrap">
            {track.album}
          </b>
        </div>
      </button>
      <button
        onClick={handleRemoveTrack}
        className="text-white/40 hover:text-red-400 transition-colors shrink-0"
        aria-label="Remove track"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
