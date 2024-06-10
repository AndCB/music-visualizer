import { Track, usePlaylist } from "@/contexts/PlaylistContext";
import React, { createRef, useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import Options from "./svgs/Options";
import styles from "../styles/TrackEntry.module.css";
import Image from "next/image";

interface TrackEntryProps {
  index: number;
  track: Track;
  isOpen: boolean;
  onMenuToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TrackEntry: React.FC<TrackEntryProps> = ({
  index,
  track,
  isOpen,
  onMenuToggle,
}) => {
  const { playTrack, currentTrackId, removeTrack } = usePlaylist();
  const containerRef = createRef<HTMLDivElement>();
  const btnRef = useRef<HTMLButtonElement>(null);
  // const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

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
      // Reduce font size
      // const fontSize = parseFloat(window.getComputedStyle(textNode).fontSize);
      textNode.classList.add(`${styles.movingText}`);
      //   textNode.style.fontSize = `${fontSize - 1}px`; // Decrease font size by 1 pixel
    }
  }, [containerRef]);

  const handleMenuToggle = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top - window.screenY - 100,
        left: rect.left - window.scrollX + 20,
      });
      // setMenuOpen(!menuOpen);
      onMenuToggle(!isOpen);
    }
  };

  const handleRemoveTrack = () => {
    removeTrack(index);
    onMenuToggle(false); // Close the menu after removing the track
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-lg p-2 ${
        index == currentTrackId
          ? "border-solid border-2 border-primary-light dark:border-primary-dark"
          : ""
      }`}
      style={{ direction: "ltr" }}
    >
      <button
        className="flex items-center text-center justify-between flex-1"
        onClick={() => playTrack(index)}
      >
        <Image
          src={track.cover ?? ""}
          alt="track cover"
          height={40}
          width={40}
          fetchPriority="low"
        />
        <div ref={containerRef} className="flex flex-col overflow-hidden">
          <span
            className={`text-primary-light dark:text-primary-dark max-w-28 font-bold whitespace-nowrap`}
          >
            <b>{track.name}</b>
          </span>
          <b className="text-primary-light dark:text-primary-dark opacity-50 text-xs text-nowrap">
            {track.album}
          </b>
        </div>
      </button>
      <IconButton
        ref={btnRef}
        className="h-6 w-6 fill-primary-light dark:fill-primary-dark"
        icon={<Options />}
        onClick={handleMenuToggle}
      />
      {isOpen && (
        <div
          className="w-32 absolute mt-2 bg-light dark:bg-dark shadow-md rounded-md p-2"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button
            onClick={handleRemoveTrack}
            className="block w-full text-center"
          >
            Remove Track
          </button>
          {/* Add more menu items as needed */}
        </div>
      )}
    </div>
  );
};
