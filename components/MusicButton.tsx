import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/MusicButton.module.css";
import DragNDrop from "./DragNDrop";
import { usePlaylist } from "@/contexts/PlaylistContext";
import { getTrackData } from "@/services/MusicMetadataService";
import { TrackEntry } from "./TrackEntry";
import Toast, { ToastMessage } from "./Toast";
import { Music2 } from "lucide-react";

export const MusicButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
      setMenuOpen(false);
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
        className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ${
          animate ? "scale-90" : ""
        }`}
        ref={btnRef}
        aria-label="Open playlist"
      >
        <Music2 className="w-8 h-8" />
      </button>
      {menuOpen && (
        <div
          className={`${styles.menu} p-2 rounded-2xl
          ${menuOpen ? styles.active : ""} 
          w-60 bg-white/20 backdrop-blur-sm border border-white/30`}
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
                <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-white/80">
                  Processing tracks...
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-white/60 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(loadingProgress.current / loadingProgress.total) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-white/50">
                {loadingProgress.current} / {loadingProgress.total}
              </span>
            </div>
          )}

          <hr className="m-4 border-t-white/20" />
          <h2 className="text-white/90">
            Playlist
          </h2>
          {playlist.length == 0 ? (
            <div className="text-white/60 text-center m-4">
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
