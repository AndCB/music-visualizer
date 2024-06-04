import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/MusicButton.module.css";
import DragNDrop from "./DragNDrop";
import { usePlaylist } from "@/contexts/PlaylistContext";
import { getTrackData } from "@/services/MusicMetadataService";
import { TrackEntry } from "./TrackEntry";

export const MusicButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  const { playlist, addTrack } = usePlaylist();

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      // setMenuOpen(false);
      setOpenMenuIndex(null);
    }
  };

  const toggleMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setMenuOpen(!menuOpen);
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 200);
    }
  };

  const handleSubmenuToggle = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const onDrop = async (files: File[]) => {
    try {
      for (const file of files) {
        try {
          const trackData = await getTrackData(file);
          addTrack(trackData);
        } catch (e) {
          console.error("Error processing file: ", e);
        }
      }
    } catch (error) {
      console.error("Error processing files: ", error);
    }
  };

  return (
    <div ref={menuRef}>
      <button
        onClick={toggleMenu}
        className={`${styles.mask} ${
          animate ? styles.animate : ""
        } bg-light dark:bg-dark`}
        ref={btnRef}
      />
      {menuOpen && (
        <div
          className={`${styles.menu} 
          after:border-b-light dark:after:border-b-dark p-2
          ${
            menuOpen ? styles.active : ""
          } w-60 bg-light dark:bg-dark border-light dark:border-dark`}
          style={{
            top: `calc(${menuPosition.top}px + 2em)`,
            left: `${menuPosition.left}px`,
          }}
        >
          <DragNDrop onFilesSelected={onDrop} />
          <hr className="m-4 border-t-primary-light dark:border-t-primary-dark" />
          <h2 className="text-primary-light dark:text-primary-dark">
            Playlist
          </h2>
          {playlist.length == 0 ? (
            <div className="text-primary-light dark:text-primary-dark text-center m-4">
              Empty!
            </div>
          ) : (
            <div
              className="flex flex-col gap-2 max-h-40 pl-2 overflow-auto"
              style={{ direction: "rtl" }}
            >
              {playlist.map((item, index) => (
                <TrackEntry
                  key={index}
                  index={index}
                  track={item}
                  isOpen={openMenuIndex === index}
                  onMenuToggle={() => handleSubmenuToggle(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
