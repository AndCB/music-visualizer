import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/MusicButton.module.css";
import DragNDrop from "./DragNDrop";
import { usePlaylist } from "@/contexts/PlaylistContext";
import { getTrackData } from "@/services/MusicMetadataService";
import { TrackEntry } from "./TrackEntry";
import Toast, { ToastMessage } from "./Toast";

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);
  const { playlist, addTrack } = usePlaylist();

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info") => {
      const id = toastIdRef.current++;
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

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
    setIsLoading(true);
    setLoadingProgress({ current: 0, total: files.length });
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const trackData = await getTrackData(file);
          addTrack(trackData);
          successCount++;
        } catch (e) {
          console.error("Error processing file: ", e);
          errorCount++;
          addToast(
            `Could not process "${file.name}". The file may be corrupted or unsupported.`,
            "error"
          );
        }
        setLoadingProgress({ current: i + 1, total: files.length });
      }

      if (successCount > 0) {
        addToast(
          `${successCount} track${successCount > 1 ? "s" : ""} added successfully!`,
          "success"
        );
      }
      if (errorCount > 0 && successCount === 0) {
        addToast("No tracks could be added. Please check the files.", "error");
      }
    } catch (error) {
      console.error("Error processing files: ", error);
      addToast("An unexpected error occurred while processing files.", "error");
    } finally {
      setIsLoading(false);
      setLoadingProgress(null);
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

          {/* Loading indicator */}
          {isLoading && loadingProgress && (
            <div className="mt-2 p-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 border-2 border-primary-light dark:border-primary-dark border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-primary-light dark:text-primary-dark">
                  Processing tracks...
                </span>
              </div>
              <div className="w-full bg-primary-light/20 dark:bg-primary-dark/20 rounded-full h-1.5">
                <div
                  className="bg-primary-light dark:bg-primary-dark h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(loadingProgress.current / loadingProgress.total) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-primary-light/60 dark:text-primary-dark/60">
                {loadingProgress.current} / {loadingProgress.total}
              </span>
            </div>
          )}

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
      {/* Toast notifications */}
      <Toast messages={toasts} onDismiss={dismissToast} />
    </div>
  );
};
